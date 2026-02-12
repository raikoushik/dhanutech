# Secure Server Layer (Node.js + Express)

Production-hardened backend for the Dhanu Tech site.

## Security controls implemented

- **Input validation and normalization** (`express-validator`, Unicode NFKC normalization, strict username whitelist).
- **SQL injection prevention** via parameterized SQLite queries (`?` placeholders).
- **CSRF protection** using session token + double-submit cookie (`dhanu.csrf`) and safe constant-time comparisons.
- **XSS mitigation** with output encoding (`escapeHtml`) for user-controlled output.
- **Authentication hardening**:
  - bcrypt hashing (12 rounds)
  - session ID regeneration on login (fixation defense)
  - rolling session expiration
  - account lockout after repeated failures
  - incremental login backoff and IP+username throttling
- **Headers hardening** with Helmet:
  - CSP
  - Referrer-Policy
  - Permissions-Policy
  - X-Frame-Options DENY
  - X-Content-Type-Options nosniff
  - HSTS in production
- **Abuse protection**: global rate limiter + auth-specific rate limiters + strict payload size limits.
- **Operational security**:
  - structured JSON logging
  - request IDs
  - sanitized log fields (log injection prevention)
  - structured errors without stack traces in production
- **Database hardening**:
  - secure DB file permissions where supported
  - username index
  - WAL mode + FK enforcement
- **HTTPS support**:
  - local self-signed cert bootstrap (`npm run gen:cert`)
  - production proxy-ready HTTPS redirect and trust-proxy support

## OWASP Top 10 mapping

- **A01 Broken Access Control**: authenticated route guard (`requireAuth`).
- **A02 Cryptographic Failures**: bcrypt password hashing, strong-session-secret enforcement, HSTS in production.
- **A03 Injection**: input whitelist + parameterized queries + payload caps.
- **A04 Insecure Design**: lockout/backoff controls and CSRF design.
- **A05 Security Misconfiguration**: hardened Helmet headers and secure cookie policies.
- **A06 Vulnerable/Outdated Components**: mainstream maintained packages only.
- **A07 Identification & Authentication Failures**: regeneration, throttling, lockout, secure sessions.
- **A08 Software/Data Integrity Failures**: strict parsing and trusted static serving.
- **A09 Security Logging & Monitoring Failures**: structured request/auth/error logs.
- **A10 SSRF**: no server-side URL fetch features exposed.

## Local usage

```bash
npm install
npm run gen:cert   # optional for local HTTPS
npm start
npm test
```

## Production notes

- Set `NODE_ENV=production` and strong `SESSION_SECRET` (>=32 chars).
- Deploy behind TLS reverse proxy (Nginx/Caddy/Cloud LB) and forward `X-Forwarded-Proto`.
- Keep DB file out of web-accessible directories and enforce least-privilege FS permissions.
