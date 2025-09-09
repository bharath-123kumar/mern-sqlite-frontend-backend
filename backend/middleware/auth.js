const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!allowedRoles.includes(req.user.role))
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  next();
};

module.exports = { authMiddleware, authorizeRoles };
