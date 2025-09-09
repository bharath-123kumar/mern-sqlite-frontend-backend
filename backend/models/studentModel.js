const { run, get, all } = require('../config/db');

async function createStudent({ userId = null, name, email, course = 'MERN Bootcamp' }) {
  const result = await run(
    `INSERT INTO students (userId, name, email, course) VALUES (?, ?, ?, ?)`,
    [userId, name, email, course]
  );
  return { id: result.id, userId, name, email, course };
}

async function findByUserId(userId) {
  return get(`SELECT * FROM students WHERE userId = ?`, [userId]);
}

async function findAll({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const students = await all(
    `SELECT * FROM students ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const count = await get(`SELECT COUNT(*) as count FROM students`);
  return { students, total: count ? count.count : 0 };
}

async function findById(id) {
  return get(`SELECT * FROM students WHERE id = ?`, [id]);
}

async function updateStudent(id, { name, email, course }) {
  const exist = await findById(id);
  if (!exist) return null;
  const newName = name || exist.name;
  const newEmail = email || exist.email;
  const newCourse = course || exist.course;
  await run(
    `UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?`,
    [newName, newEmail, newCourse, id]
  );
  return findById(id);
}

async function deleteStudent(id) {
  const res = await run(`DELETE FROM students WHERE id = ?`, [id]);
  return res.changes;
}

module.exports = {
  createStudent,
  findByUserId,
  findAll,
  findById,
  updateStudent,
  deleteStudent
};
