const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const request = require('supertest');

process.env.DB_PATH = path.join(__dirname, 'test.sqlite');
process.env.SESSION_SECRET = 'test-secret-with-adequate-length-123456';

const { prepareApp } = require('../src/app');

let app;
let agent;

async function csrfToken(client = agent) {
  const res = await client.get('/api/csrf-token');
  return res.body.csrfToken;
}

test.before(async () => {
  if (fs.existsSync(process.env.DB_PATH)) fs.unlinkSync(process.env.DB_PATH);
  app = await prepareApp({ nodeEnv: 'test' });
  agent = request.agent(app);
});

test.after(() => {
  if (fs.existsSync(process.env.DB_PATH)) fs.unlinkSync(process.env.DB_PATH);
});

test('blocks SQL injection payload in login via validation + parameterized query', async () => {
  const token = await csrfToken();
  const res = await agent
    .post('/api/login')
    .set('x-csrf-token', token)
    .send({ username: "admin' OR 1=1 --", password: 'anything' });

  assert.equal(res.status, 400);
});

test('blocks state-changing request when CSRF token is missing', async () => {
  const res = await agent.post('/api/login').send({ username: 'admin', password: 'ChangeMe123!' });
  assert.equal(res.status, 403);
});

test('blocks CSRF token length mismatch safely', async () => {
  const badToken = 'abcd';
  const res = await agent
    .post('/api/login')
    .set('x-csrf-token', badToken)
    .send({ username: 'admin', password: 'ChangeMe123!' });

  assert.equal(res.status, 403);
  assert.equal(res.body.error.code, 'INVALID_CSRF');
});

test('sanitizes XSS content in output', async () => {
  const payload = '<img src=x onerror=alert(1)>';
  const res = await agent.get('/api/echo').query({ q: payload }).expect(200);
  assert.equal(res.body.message, '&lt;img src=x onerror=alert(1)&gt;');
});

test('rotates session id on login (session fixation prevention)', async () => {
  const before = await agent.get('/api/csrf-token');
  const preCookie = (before.headers['set-cookie'] || []).find((c) => c.startsWith('__Host-dhanu.sid='));

  const token = before.body.csrfToken;
  const loginRes = await agent
    .post('/api/login')
    .set('x-csrf-token', token)
    .send({ username: 'admin', password: 'ChangeMe123!' })
    .expect(200);

  const postCookie = (loginRes.headers['set-cookie'] || []).find((c) => c.startsWith('__Host-dhanu.sid='));
  assert.ok(preCookie);
  assert.ok(postCookie);
  assert.notEqual(preCookie.split(';')[0], postCookie.split(';')[0]);
});

test('account lockout after repeated failures', async () => {
  const client = request.agent(app);
  for (let i = 0; i < 8; i += 1) {
    const token = await csrfToken(client);
    await client
      .post('/api/login')
      .set('x-csrf-token', token)
      .send({ username: 'admin', password: 'WrongPassword!1' });
  }

  const token = await csrfToken(client);
  const res = await client
    .post('/api/login')
    .set('x-csrf-token', token)
    .send({ username: 'admin', password: 'WrongPassword!1' });

  assert.equal(res.status, 423);
  assert.equal(res.body.error.code, 'ACCOUNT_LOCKED');
});

test('csp header is present and strict', async () => {
  const res = await request(app).get('/api/csrf-token').expect(200);
  const csp = res.headers['content-security-policy'];
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
});

test('hsts header present in production mode', async () => {
  const prodApp = await prepareApp({ nodeEnv: 'production', sessionSecret: 'prod-secret-value-with-minimum-length-12345' });
  const res = await request(prodApp)
    .get('/api/csrf-token')
    .set('x-forwarded-proto', 'https')
    .expect(200);

  assert.ok(res.headers['strict-transport-security']);
});

test('global rate limiting is enforced', async () => {
  const limitedApp = await prepareApp({ nodeEnv: 'test', globalRateMax: 2, globalRateWindowMs: 60_000 });
  const client = request(limitedApp);

  await client.get('/api/csrf-token').expect(200);
  await client.get('/api/csrf-token').expect(200);
  const blocked = await client.get('/api/csrf-token');
  assert.equal(blocked.status, 429);
});
