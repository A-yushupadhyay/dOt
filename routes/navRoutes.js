// Add near other requires
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Doctor = require('../models/doctor');
const wrapAsync = require('../utils/wrapAsync');
const authMiddle = require('../middleware/authMiddle');
const underConstruction = require('../middleware/underConstruction');

// Contact Us Page
router.get('/contact',authMiddle, (req, res) => {
   res.render('main/contact'); // views/main/contact.ejs
});

// Doctors List Page
router.get('/doctors',authMiddle, wrapAsync(async (req, res) => {
   const doctors = await Doctor.find({});
   res.render('main/doctor', { doctors }); // views/main/doctors.ejs
}));
router.post('/contact',authMiddle, underConstruction,wrapAsync(async (req, res)=> {
   console.log("all ok");

}));

module.exports = router;