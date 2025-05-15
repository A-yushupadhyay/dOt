const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      // No token — redirect to login
      return res.redirect('/user/login');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // Find the user
    const user = await User.findById(decoded._id);
    if (!user) {
      // If user doesn't exist — clear token and redirect
      res.clearCookie('token');
      return res.redirect('/user/login');
    }

    // Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);

    // On error — clear token and redirect
    res.clearCookie('token');
    return res.redirect('/user/login');
  }
};

module.exports = authenticateUser;