const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'student', course } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Missing required fields' });

    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ name, email, password: hashed, role });

    if (role === 'student') {
      await studentModel.createStudent({
        userId: user.id,
        name,
        email,
        course: course || 'MERN Bootcamp'
      });
    }

    const token = signToken(user);
    res.status(201).json({
      message: 'User created',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('signup error', err);
    // if unique constraint error
    if (err && err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({
      message: 'Logged in',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
