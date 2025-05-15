require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const wrapAsync = require('../utils/wrapAsync');
const { signupSchema, loginSchema } = require('../utils/schema');
const { validateSchema } = require('../middleware/validate');

const router = express.Router();

// === GET Register Form ===


// === POST Register ===
router.post('/register', validateSchema(signupSchema), wrapAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).render('Auth/signup', {
      oldInput: req.body,
      errors: { email: 'User already exists. Please log in.' },
      currentUser: null
    });
  }

  const user = new User({ name, email, password, role });
  await user.save();

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 86400000
    })
    .cookie('welcome', 'true', { maxAge: 30000 }); // 30 seconds

  return role === 'doctor'
    ? res.redirect('/doctors/add')
    : res.redirect('/home');
}));

// === GET Login Form ===
router.get('/login', (req, res) => {
  res.render('Auth/login', {
    oldInput: {},
    errors: {},
    currentUser: null
  });
});

// === POST Login ===
router.post('/login', validateSchema(loginSchema), wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).render('Auth/login', {
      oldInput: req.body,
      errors: { email: 'Invalid email or password' },
      currentUser: null
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 86400000
    })
    .cookie('welcome', 'true', { maxAge: 30000 }); // 30 seconds

  if (user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) return res.redirect('/doctors/add');
    return res.redirect(`/doctors/${doctor._id}`);
  }

  return res.redirect('/home');
}));

// === Logout ===
router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/user/login');
});

module.exports = router;
