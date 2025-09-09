const { run, get } = require('../config/db');

async function createUser({ name, email, password, role = 'student' }) {
  const result = await run(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, password, role]
  );
  return { id: result.id, name, email, role };
}

async function findByEmail(email) {
  return get(`SELECT * FROM users WHERE email = ?`, [email]);
}

async function findById(id) {
  return get(`SELECT * FROM users WHERE id = ?`, [id]);
}

module.exports = { createUser, findByEmail, findById };
