const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authenticated user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_coffee_craft_jwt_token_key_2026'
      );
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
      return next();
    } catch (error) {
      console.error('Auth token error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Optional auth - if token is present, populate req.user, else continue as guest
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_coffee_craft_jwt_token_key_2026'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      req.user = null;
    }
  }
  next();
};

// Restrict to admin users
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
};

module.exports = { protect, optionalAuth, adminOnly };
