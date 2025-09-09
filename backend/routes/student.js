const express = require('express');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const studentModel = require('../models/studentModel');
const userModel = require('../models/userModel');

const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const data = await studentModel.findAll({ page, limit });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, course, userId } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Missing fields' });

    if (userId) {
      const user = await userModel.findById(userId);
      if (!user) return res.status(400).json({ message: 'Provided userId not found' });
    }
    const student = await studentModel.createStudent({ userId: userId || null, name, email, course });
    res.status(201).json({ message: 'Student created', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authMiddleware, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await studentModel.findByUserId(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (req.user.role === 'student' && student.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (req.user.role === 'student' && student.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    const updated = await studentModel.updateStudent(req.params.id, req.body);
    res.json({ message: 'Student updated', student: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const changes = await studentModel.deleteStudent(req.params.id);
    if (!changes) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
