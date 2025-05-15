const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const User = require('../models/user'); // ✅ Add this line
const authMiddle = require('../middleware/authMiddle');
const generateVideoCallLink = require("../utils/vedioCallUtils");
const updateUserToken = require("../utils/updateUserToken");
const multer = require('multer');
const path = require('path');
const methodOverride = require('method-override');
const { title } = require('process');
 // Assuming you have an Appointment model
const jwt = require('jsonwebtoken');
const wrapAsync = require('../utils/wrapAsync');  
require('dotenv').config();





// Home Route
router.get('/home', authMiddle, wrapAsync(async (req, res) => {
   const token = req.cookies.token;
   if (!token) return res.status(401).send('Unauthorized');

   let showWelcome = false;

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decoded._id);
      showWelcome = req.cookies.welcome === 'true';

      if (!currentUser) return res.status(404).send('User not found');

      const videoAppointment = await Appointment.findOne({
         patient: currentUser._id,
         isVideoCall: true,
         status: "completed"
      });

      res.clearCookie('welcome');

      res.render('main/home', {
         currentUser,
         videoAppointment,
         hasVideoAppointment: !!videoAppointment,
         videoCallLink: videoAppointment ? videoAppointment.videoCallLink : null,
         showWelcome
      });
   } catch (err) {
      console.log("JWT Error:", err.message);
      res.status(401).send('Invalid Token');
   }
}));

// Refresh Home Route
router.get("/refresh-home", authMiddle, wrapAsync(async (req, res) => {
   try {
      const token = req.cookies.token;
      if (!token) {
         return res.status(401).json({ message: "No token found" });
      }

      const decoded = jwt.verify(token, "secretkey");
      const user = await User.findById(decoded._id);

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      await updateUserToken(res, user);

      res.redirect("/home");
   } catch (error) {
      console.error("Error refreshing home:", error);
      res.redirect("/");
   }
}));

// Root
router.get("/", (req, res) => {
   res.render("Auth/signup", {
     errors: {},        // no validation errors initially
     oldInput: {}       // no old input initially
   });
 });
module.exports = router; // ✅ Must export router!
