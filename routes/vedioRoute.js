const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const authMiddle = require('../middleware/authMiddle');
const wrapAsync = require('../utils/wrapAsync'); // Utility for async error handling



router.get('/:id',authMiddle, wrapAsync(async (req, res) => {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);
  
    if (!appointment || !appointment.isVideoCall) {
      return res.status(404).json({ message: "Video call not available for this appointment." });
    }
  
    res.json({ link: appointment.videoCallLink });
  }));

module.exports = router;