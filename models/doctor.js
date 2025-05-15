const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  consultationType: { type: String, enum: ['in-person', 'video'], required: true },
  fee: { type: Number, required: true },
  availableSlots: [{ type: Date }] ,// Available time slots for booking
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 👈 added this
  image: {
    type: String,
    default: '/views/assets/doctor-avatar.jpg' // fallback image
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);