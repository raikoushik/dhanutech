const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data.sqlite');

function ensureDbPermissions(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, 0o600);
    }
  } catch (_) {
    // Non-fatal on environments that do not support chmod semantics.
  }
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (!err) ensureDbPermissions(DB_PATH);
});

db.configure('busyTimeout', 5000);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function initDb() {
  await run('PRAGMA journal_mode = WAL');
  await run('PRAGMA foreign_keys = ON');

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      lockout_until INTEGER DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username)');

  const existing = await get('SELECT id FROM users WHERE username = ?', ['admin']);
  if (!existing) {
    const hash = await bcrypt.hash('ChangeMe123!', 12);
    await run('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['admin', hash]);
  }

  ensureDbPermissions(DB_PATH);
}

module.exports = {
  db,
  initDb,
  run,
  get,
  DB_PATH
};
