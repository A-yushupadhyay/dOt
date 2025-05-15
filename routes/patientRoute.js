// routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddle = require('../middleware/authMiddle'); // JWT middleware
const multer = require('multer');
const path = require('path');
const wrapAsync = require('../utils/wrapAsync'); // Utility for async error handling

// ✅ Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/patients/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// ✅ View Profile
router.get('/profile', authMiddle, wrapAsync(async (req, res) => {
  const patient = await User.findById(req.user.id);
  res.render('patients/profile', { title: 'My Profile', patient, showProfilePopup: !patient.isProfileUpdated, });
}));

// ✅ Edit Profile (GET)
router.get('/profile/edit', authMiddle, wrapAsync(async (req, res) => {
  const patient = await User.findById(req.user.id);
  res.render('patients/editProfile', { title: 'Edit Profile', patient });
}));

// ✅ Edit Profile (POST)
router.post('/profile/edit', authMiddle, upload.single('profileImage'), wrapAsync(async (req, res) => {
  const { name, age, gender, phone, address, medicalHistory ,} = req.body;

  const updatedData = {
    name, age, gender, phone, address, medicalHistory,isProfileUpdated: true
  };

  if (req.file) {
    updatedData.profileImage = `/uploads/patients/${req.file.filename}`;
  }

  await User.findByIdAndUpdate(req.user.id, updatedData);
  res.redirect('/patients/profile');
}));

module.exports = router;
