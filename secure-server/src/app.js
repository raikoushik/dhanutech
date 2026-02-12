const crypto = require('crypto');
const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { initDb, get, run } = require('./db');
const { log, requestId, sanitizeLogValue } = require('./logger');

const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,32}$/;
const CSRF_LEN = 48;
const ACCOUNT_LOCK_THRESHOLD = 8;
const ACCOUNT_LOCK_MS = 15 * 60 * 1000;

const loginAttemptsByKey = new Map();

function getNow() {
  return Date.now();
}

function parseCookies(header = '') {
  return header.split(';').reduce((acc, item) => {
    const [k, ...rest] = item.trim().split('=');
    if (!k) return acc;
    acc[k] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function normalizeInput(value) {
  return String(value || '').normalize('NFKC').trim();
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hasDangerousContent(value) {
  return /[<>\u0000-\u001F\u007F]/.test(String(value || ''));
}

function generateCsrfToken() {
  return crypto.randomBytes(24).toString('hex');
}

function isSafeTokenShape(token) {
  return typeof token === 'string' && token.length === CSRF_LEN && /^[a-f0-9]+$/i.test(token);
}

function setCsrfCookie(req, res) {
  res.cookie('dhanu.csrf', req.session.csrfToken, {
    httpOnly: false,
    secure: req.app.get('env') === 'production',
    sameSite: 'strict',
    path: '/'
  });
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function loginAttemptKey(ip, username) {
  return `${ip}::${username.toLowerCase()}`;
}

function getBackoffDelayMs(key) {
  const rec = loginAttemptsByKey.get(key);
  if (!rec) return 0;

  const attempts = rec.count || 0;
  if (attempts < 3) return 0;
  return Math.min(10_000, 250 * (2 ** (attempts - 3)));
}

function registerFailure(key) {
  const now = getNow();
  const rec = loginAttemptsByKey.get(key) || { count: 0, last: now };
  rec.count += 1;
  rec.last = now;
  loginAttemptsByKey.set(key, rec);
}

function registerSuccess(key) {
  loginAttemptsByKey.delete(key);
}

function cleanAttemptCache() {
  const now = getNow();
  for (const [key, rec] of loginAttemptsByKey.entries()) {
    if (now - rec.last > 60 * 60 * 1000) loginAttemptsByKey.delete(key);
  }
}
setInterval(cleanAttemptCache, 10 * 60 * 1000).unref();

function requireProductionSecret(sessionSecret, env) {
  if (env !== 'production') return;
  if (!sessionSecret || sessionSecret.length < 32 || sessionSecret.includes('change-me')) {
    throw new Error('SESSION_SECRET must be set to a strong value in production (min 32 chars)');
  }
}

function createApp(config = {}) {
  const app = express();
  const env = config.nodeEnv || process.env.NODE_ENV || 'development';
  app.set('env', env);

  const sessionSecret = config.sessionSecret || process.env.SESSION_SECRET || 'dev-only-change-me';
  requireProductionSecret(sessionSecret, env);

  if (config.trustProxy || env === 'production') {
    app.set('trust proxy', 1);
  }

  app.disable('x-powered-by');

  app.use((req, res, next) => {
    req.id = requestId();
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
      log('info', 'http_request', {
        reqId: req.id,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        ip: req.ip,
        ua: sanitizeLogValue(req.headers['user-agent'] || ''),
        durationMs: Math.round(durationMs * 100) / 100
      });
    });
    next();
  });

  if (env === 'production') {
    app.use((req, res, next) => {
      const proto = req.headers['x-forwarded-proto'];
      if (req.secure || proto === 'https') return next();
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    });
  }

  app.use(helmet({
    referrerPolicy: { policy: 'no-referrer' },
    frameguard: { action: 'deny' },
    noSniff: true,
    hsts: env === 'production' ? { maxAge: 15552000, includeSubDomains: true, preload: false } : false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        // Static legacy pages contain inline style blocks; keeping this for compatibility.
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: env === 'production' ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    permissionsPolicy: {
      features: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
        usb: []
      }
    }
  }));

  app.use(express.json({ limit: '50kb', strict: true }));
  app.use(express.urlencoded({ extended: false, limit: '25kb' }));

  app.use(session({
    name: '__Host-dhanu.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: env === 'production',
    cookie: {
      httpOnly: true,
      secure: env === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 20,
      path: '/'
    }
  }));

  const globalLimiter = rateLimit({
    windowMs: Number(config.globalRateWindowMs || 5 * 60 * 1000),
    max: Number(config.globalRateMax || 200),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } }
  });
  app.use(globalLimiter);

  const authLimiterByIp = rateLimit({
    windowMs: Number(config.authRateWindowMs || 10 * 60 * 1000),
    max: Number(config.authRateMaxIp || 30),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip,
    message: { error: { code: 'AUTH_RATE_LIMITED', message: 'Too many auth attempts by IP' } }
  });

  const authLimiterByIpUser = rateLimit({
    windowMs: Number(config.authRateWindowMs || 10 * 60 * 1000),
    max: Number(config.authRateMaxCombo || 12),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => loginAttemptKey(req.ip, normalizeInput(req.body.username || 'unknown')),
    message: { error: { code: 'AUTH_COMBO_LIMIT', message: 'Too many attempts for this user/IP pair' } }
  });

  app.use((req, res, next) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = generateCsrfToken();
    }
    setCsrfCookie(req, res);
    return next();
  });

  app.use((req, res, next) => {
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();

    const sentToken = req.get('x-csrf-token') || req.body._csrf;
    const cookieToken = parseCookies(req.headers.cookie || '')['dhanu.csrf'];
    const sessionToken = req.session.csrfToken;

    if (![sentToken, cookieToken, sessionToken].every(isSafeTokenShape)) {
      return res.status(403).json({ error: { code: 'INVALID_CSRF', message: 'Invalid CSRF token' } });
    }

    const a = Buffer.from(sentToken);
    const b = Buffer.from(sessionToken);
    const c = Buffer.from(cookieToken);

    if (a.length !== b.length || b.length !== c.length) {
      return res.status(403).json({ error: { code: 'INVALID_CSRF', message: 'Invalid CSRF token' } });
    }

    if (!crypto.timingSafeEqual(a, b) || !crypto.timingSafeEqual(b, c)) {
      return res.status(403).json({ error: { code: 'INVALID_CSRF', message: 'Invalid CSRF token' } });
    }

    return next();
  });

  function requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Authentication required' } });
    }
    return next();
  }

  app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.session.csrfToken });
  });

  app.get('/api/echo', (req, res) => {
    const q = String(req.query.q || '').slice(0, 300);
    return res.json({ message: escapeHtml(q) });
  });

  const usernameValidation = body('username')
    .customSanitizer(normalizeInput)
    .isLength({ min: 3, max: 32 })
    .matches(USERNAME_REGEX)
    .custom((value) => {
      if (hasDangerousContent(value)) throw new Error('Username contains dangerous characters');
      return true;
    });

  const passwordValidation = body('password')
    .isString()
    .isLength({ min: 10, max: 128 })
    .custom((value) => {
      if (hasDangerousContent(value)) throw new Error('Password contains invalid characters');
      return true;
    });

  app.post('/api/register', authLimiterByIp, authLimiterByIpUser, usernameValidation, passwordValidation, asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { code: 'VALIDATION_FAILED', details: errors.array() } });
    }

    const username = req.body.username;
    const password = req.body.password;

    const existing = await get('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) return res.status(409).json({ error: { code: 'USER_EXISTS', message: 'Username already exists' } });

    const passwordHash = await bcrypt.hash(password, 12);
    await run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
    return res.status(201).json({ message: 'Registered' });
  }));

  app.post('/api/login', authLimiterByIp, authLimiterByIpUser, usernameValidation, body('password').isString().isLength({ min: 1, max: 128 }), asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log('warn', 'login_validation_failed', { reqId: req.id, ip: req.ip });
      return res.status(400).json({ error: { code: 'VALIDATION_FAILED', details: errors.array() } });
    }

    const username = req.body.username;
    const password = req.body.password;

    const key = loginAttemptKey(req.ip, username);
    const backoffMs = getBackoffDelayMs(key);
    if (backoffMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }

    const user = await get('SELECT id, username, password_hash, failed_attempts, lockout_until FROM users WHERE username = ?', [username]);

    if (user && user.lockout_until && user.lockout_until > getNow()) {
      registerFailure(key);
      return res.status(423).json({
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account temporarily locked due to repeated failures'
        }
      });
    }

    if (!user) {
      registerFailure(key);
      log('warn', 'login_failed_user_not_found', { reqId: req.id, ip: req.ip, username: sanitizeLogValue(username) });
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      registerFailure(key);
      const newFails = (user.failed_attempts || 0) + 1;
      const lockUntil = newFails >= ACCOUNT_LOCK_THRESHOLD ? getNow() + ACCOUNT_LOCK_MS : null;
      await run('UPDATE users SET failed_attempts = ?, lockout_until = ? WHERE id = ?', [newFails, lockUntil, user.id]);

      log('warn', 'login_failed_bad_password', {
        reqId: req.id,
        ip: req.ip,
        username: sanitizeLogValue(username),
        failedAttempts: newFails,
        lockout: Boolean(lockUntil)
      });

      const code = lockUntil ? 423 : 401;
      return res.status(code).json({
        error: {
          code: lockUntil ? 'ACCOUNT_LOCKED' : 'INVALID_CREDENTIALS',
          message: lockUntil ? 'Account temporarily locked due to repeated failures' : 'Invalid credentials'
        }
      });
    }

    registerSuccess(key);
    await run('UPDATE users SET failed_attempts = 0, lockout_until = NULL WHERE id = ?', [user.id]);

    await new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) return reject(err);
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.csrfToken = generateCsrfToken();
        setCsrfCookie(req, res);
        resolve();
      });
    });

    return res.json({ message: 'Logged in' });
  }));

  app.post('/api/logout', requireAuth, (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('__Host-dhanu.sid');
      res.clearCookie('dhanu.csrf');
      res.json({ message: 'Logged out' });
    });
  });

  app.get('/api/profile', requireAuth, (req, res) => {
    res.json({ username: escapeHtml(req.session.username) });
  });

  app.use(express.static(path.join(__dirname, '..', '..')));

  app.use((req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
  });

  app.use((err, req, res, _next) => {
    log('error', 'unhandled_error', {
      reqId: req.id,
      path: req.path,
      message: sanitizeLogValue(err.message),
      stack: app.get('env') === 'production' ? undefined : sanitizeLogValue(err.stack || '')
    });

    if (err && err.type === 'entity.too.large') {
      return res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Payload too large' } });
    }

    const message = app.get('env') === 'production' ? 'Internal server error' : err.message;
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message } });
  });

  return app;
}

async function prepareApp(config = {}) {
  await initDb();
  return createApp(config);
}

module.exports = { createApp, prepareApp };
