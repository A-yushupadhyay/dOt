const express = require('express');
const mongoose = require('mongoose');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const authMiddle = require('../middleware/authMiddle');
const generateVideoCallLink = require("../utils/vedioCallUtils");
const updateUserToken = require("../utils/updateUserToken");
const wrapAsync = require('../utils/wrapAsync');

const { appointmentSchema } = require("../utils/schema");
const { validateSchema } = require("../middleware/validate");

const router = express.Router();

// POST route to book an appointment
router.post('/book', authMiddle, wrapAsync(async (req, res) => {
    try {
        const { doctorId, date ,isVideoCall } = req.body;
        const patientId = req.user._id; // Use `_id` instead of `id`

        // add link 
        const videoCall = isVideoCall === "on"; // Convert checkbox value to boolean
        let videoCallLink = "";
        if (videoCall) {
            videoCallLink = generateVideoCallLink(); // Generate unique video link
        }
      


        // Validate doctor existence
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).send('Doctor not found');

        // Validate selected date is available
        const selectedDate = new Date(date);
        if (!doctor.availableSlots.some(slot => slot.getTime() === selectedDate.getTime())) {
            return res.status(400).send('Selected slot is no longer available');
        }

        // Create appointment
        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date: selectedDate,
            isVideoCall: videoCall,
            videoCallLink,
            status: 'pending'
        });

        await appointment.save();
          // Update user object
          req.user.hasVideoAppointment = videoCall;
          req.user.videoCallLink = videoCall ? appointment.videoCallLink : null;
          await req.user.save();
  
          // Refresh token
          updateUserToken(res, req.user);

        // Remove booked slot from doctor's availability
        doctor.availableSlots = doctor.availableSlots.filter(slot => slot.getTime() !== selectedDate.getTime());
        await doctor.save();

        res.redirect(`/app/pay/${appointment._id}`); // Redirect to initiate payment
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}));
router.get('/pay/:appointmentId', authMiddle, wrapAsync((async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate('patient', 'name email')
            .populate('doctor', 'name specialty consultationType fee');

        if (!appointment) return res.status(404).send('Appointment not found');

        res.render('payment', { appointment });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})));
router.get('/appointment', wrapAsync(async (req, res) => {
    try {
        const doctors = await Doctor.find(); // Fetch all doctors
        res.render('appointment/appointment', { doctors }); // Pass doctors to the view
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send("Server Error");
    }
}));


module.exports = router;
