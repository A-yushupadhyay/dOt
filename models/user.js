const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },

  // Patient profile-specific fields
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  phone: String,
  address: String,
  medicalHistory: String,
  profileImage: String, // Path to image if uploaded
  // profileupdation notification
  isProfileUpdated: {
    type: Boolean,
    default: false,
  }
});

// Hash password before saving
// Automatically hash password before saving to DB
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password changed
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
