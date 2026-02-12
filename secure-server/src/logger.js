const crypto = require('crypto');

function sanitizeLogValue(value) {
  if (value === null || value === undefined) return value;
  return String(value).replace(/[\r\n\t]/g, ' ').slice(0, 300);
}

function log(level, event, meta = {}) {
  const safeMeta = Object.fromEntries(
    Object.entries(meta).map(([k, v]) => [k, typeof v === 'object' && v !== null ? v : sanitizeLogValue(v)])
  );

  const record = {
    ts: new Date().toISOString(),
    level,
    event,
    ...safeMeta
  };

  const line = JSON.stringify(record);
  if (level === 'error' || level === 'warn') {
    console.error(line);
  } else {
    console.log(line);
  }
}

function requestId() {
  return crypto.randomUUID();
}

module.exports = {
  log,
  requestId,
  sanitizeLogValue
};
