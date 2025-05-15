const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  // ✅ Add `payment` field
  payment: {
    orderId: { type: String, default: null },  // Razorpay Order ID
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' } // Payment Status
  },
  isVideoCall: { type: Boolean, default: false }, // Flag for video appointments
  videoCallLink: { type: String, default: null },
  // status: { type: String, enum: ["upcoming", "completed", "canceled"], default: "upcoming" },
  reminderSent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);