const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { prepareApp } = require('./app');
const { log } = require('./logger');

const PORT = Number(process.env.PORT || 3000);
const keyPath = path.join(__dirname, '..', 'certs', 'dev-key.pem');
const certPath = path.join(__dirname, '..', 'certs', 'dev-cert.pem');

(async () => {
  try {
    const app = await prepareApp({
      nodeEnv: process.env.NODE_ENV,
      sessionSecret: process.env.SESSION_SECRET,
      trustProxy: true
    });

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      const credentials = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      https.createServer(credentials, app).listen(PORT, () => {
        log('info', 'server_started_https', { port: PORT });
      });
    } else {
      http.createServer(app).listen(PORT, () => {
        log('info', 'server_started_http', { port: PORT, note: 'Run npm run gen:cert for local HTTPS' });
      });
    }
  } catch (err) {
    log('error', 'server_start_failed', { message: err.message });
    process.exit(1);
  }
})();
