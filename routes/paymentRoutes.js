const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Appointment = require('../models/appointment');
const authMiddle = require('../middleware/authMiddle');
const Doctor = require('../models/doctor');
const updateUserToken = require("../utils/updateUserToken");

const nodemailer = require("nodemailer");
require('dotenv').config();
const mongoose = require('mongoose');
const wrapAsync = require('../utils/wrapAsync');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// initial nodemailer

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});


router.get("/process", authMiddle,wrapAsync(async (req, res) => {
    try {
      const { orderId } = req.query;
      if (!orderId) {
        return res.status(400).json({ error: "Missing order ID" });
      }
  
      res.render("paymentprocess", { orderId, razorpayKey: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
      res.status(500).json({ error: "Error rendering payment page" });
    }
  }));

// API to create a Razorpay order
router.post('/start', authMiddle,wrapAsync(async (req, res) => {
    try {
        const { appointmentId, amount } = req.body;
         // 🔴 FIX: Validate `appointmentId` before querying MongoDB
         if (!mongoose.Types.ObjectId.isValid(appointmentId)) {  
            return res.status(400).json({ error: "Invalid appointment ID format" });
        }


        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const options = {
            amount: amount * 100, // Convert to paisa
            currency: "INR",
            receipt: `receipt_${appointmentId}`
        };

        const order = await razorpay.orders.create(options);
          // 🔴 **FIX: Save orderId in the database**
          appointment.payment = { orderId: order.id };  // Ensure `payment` field exists in schema
          await appointment.save();  // Save updated appointment
  
        

        res.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating payment order' });
    }
}));
//  This API sends Razorpay order details to paymentProcess.ejs.
router.get('/details',authMiddle, wrapAsync(async (req, res) => {
    try {
        const { orderId } = req.query;
        
        const appointment = await Appointment.findOne({ "payment.orderId": orderId });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({
            success: true,
            orderId: orderId,
            amount: appointment.doctor.fee * 100,
            razorpayKey: process.env.RAZORPAY_KEY_ID,
            appointmentId: appointment._id,
            email: appointment.patient.email
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order details' });
    }
}));

router.post('/verify', authMiddle,wrapAsync(async (req, res) => {
    try {
        const { appointmentId, paymentId } = req.body;

        const appointment = await Appointment.findById(appointmentId).populate("patient doctor");
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
       

        appointment.status = "confirmed";
        appointment.payment.orderId = paymentId;
        appointment.payment.status = "paid";

        await appointment.save();

          // Update appointment status
          appointment.status = "confirmed";
          appointment.payment = { orderId: paymentId, status: "paid" };
          await appointment.save();
  
          // Send Email Receipt
          const mailOptions = {
              from: `"DocOnTime" <${process.env.EMAIL_USER}>`,
              to: appointment.patient.email,
              subject: "Payment Receipt - DocOnTime",
              html: `
                  <h2>Payment Successful!</h2>
                  <p>Dear ${appointment.patient.name},</p>
                  <p>Your appointment with Dr. ${appointment.doctor.name} has been confirmed.</p>
                  <p><strong>Appointment Details:</strong></p>
                  <ul>
                      <li><strong>Doctor:</strong> ${appointment.doctor.name}</li>
                      <li><strong>Date:</strong> ${appointment.date.toDateString()}</li>
                      <li><strong>Amount Paid:</strong> ₹${appointment.doctor.fee}</li>
                      <li><strong>Payment ID:</strong> ${paymentId}</li>
                  </ul>
                  <p>Thank you for using <strong>DocOnTime</strong>!</p>
              `
          };
         
          
          await transporter.sendMail(mailOptions);

          

        res.json({ success: true, message: 'Payment verified, appointment confirmed!' });
      
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
}));

// for reciept route
router.get('/appointment-success', authMiddle, wrapAsync(async (req, res) => {
    try {
        const { appointmentId } = req.query;
        await Appointment.findByIdAndUpdate(appointmentId, { status: "completed" });

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {  
            return res.status(400).json({ error: "Invalid appointment ID format" });
        }

        const appointment = await Appointment.findById(appointmentId)
            .populate("patient doctor"); // Fetch related patient & doctor details

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.render('reciept/reciept' , {appointment});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching appointment details" });
    }
}));


// routes/payment.js
router.post('/cancel', authMiddle, wrapAsync(async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).send("Invalid appointment ID format");
        }

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: "canceled" },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        // Free the doctor's slot
        await Doctor.findByIdAndUpdate(appointment.doctor, {
            $addToSet: { availableSlots: appointment.date }
        });

        // Only update token *before* sending the response
        if (appointment.isVideoCall) {
            req.user.hasVideoAppointment = false;
            req.user.videoCallLink = null;
            await updateUserToken(res, req.user); // ✅ before redirect!
        }

        return res.redirect("/app/appointment"); // ✅ Send response only once
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error canceling appointment");
    }
}));




module.exports = router;
