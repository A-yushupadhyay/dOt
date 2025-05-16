const express = require('express');
const mongoose = require('mongoose');
const Doctor = require('../models/doctor'); 
const User = require('../models/user'); 
const authMiddle = require("../middleware/authMiddle");
const multer = require('multer');
const path = require('path');
const methodOverride = require('method-override');
const Appointment = require('../models/appointment'); 
const wrapAsync = require('../utils/wrapAsync');
const { doctorSchema } = require("../utils/schema");
const {
    validateSchema,
    validateAddDoctor,
    validateEditDoctor
  } = require("../middleware/validate");



const router = express.Router();

// Use method-override to support PUT and DELETE requests in forms
router.use(methodOverride('_method'));

// Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST route to add a doctor
router.post('/add', authMiddle, upload.single('image'),validateAddDoctor, wrapAsync(async (req, res) => {
    try {
        const { name, email, phone, specialty, experience, consultationType, fee, availableSlots } = req.body;
        const userId = req.user ? req.user.id : null;

        console.log("Request Body:", req.body);
        console.log("Extracted User ID:", userId);

        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        const user = await User.findById(userId);
        if (!user || user.role === 'patient') {
            return res.status(403).send('Unauthorized: Patients cannot add doctors');
        }

        // Check if the email already exists to avoid duplicate entry
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).send('Error: Doctor with this email already exists');
        }

        // Ensure availableSlots is parsed correctly
        let formattedSlots = [];
        if (availableSlots) {
            try {
                const parsedSlots = typeof availableSlots === "string" ? JSON.parse(availableSlots) : availableSlots;

                formattedSlots = parsedSlots.map(slot => {
                    const formattedDate = new Date(`${slot}:00Z`); // Append seconds & enforce UTC
                    if (isNaN(formattedDate)) {
                        throw new Error(`Invalid date format: ${slot}`);
                    }
                    return formattedDate;
                });

            } catch (err) {
                return res.status(400).send('Invalid availableSlots format');
            }
        }

        // Validate slots are in the future
        const currentDate = new Date();
        const validSlots = formattedSlots.filter(slot => slot > currentDate);

        // Get image path
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newDoctor = new Doctor({
            name,
            email,
            phone,
            specialty,
            experience,
            consultationType,
            fee,
            availableSlots: validSlots,
            image: imagePath, // Save image path
            user: userId //  Save the user ID here
        });

        await newDoctor.save();
        console.log("New Doctor Created:", newDoctor);
        res.redirect(`/doctors/${newDoctor._id}`); // Redirect to the new doctor's profile page

    } catch (error) {
        console.error("Error:", error);
        res.render('doctor/doctor', {
            title: 'Add Doctor',
            error: error, // Joi error, etc.
            doctorData: req.body
          });
        
    }
}));

// GET route to render the Add Doctor page
router.get('/add', authMiddle, (req, res) => {
    res.render('doctor/doctor', {
      title: 'Add Doctor',
      error: null,
      doctorData: {}
    });
  });
// Live Search Route for Doctors
router.get("/search", wrapAsync(async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.json([]);

        const doctors = await Doctor.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { specialty: { $regex: query, $options: "i" } }
            ]
        }).limit(10); // Limit to 10 results
        res.json(doctors);
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
}));

// GET route for Doctor Profile page
router.get("/:id", authMiddle, wrapAsync(async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate("user");

        if (!doctor) return res.status(404).send("Doctor not found");

        // Safely extract user ID
        const doctorUserId = doctor.user._id.toString();

        res.render("doctor/doctorProfile", { doctor, currentUser: req.user, doctorUserId, title: "Doctor Profile" });
    } catch (error) {
        console.error("Doctor Profile Error:", error);
        res.status(500).send("Server Error");
    }
}));

// GET route to render the Edit Doctor page
router.get('/:id/edit', authMiddle, wrapAsync(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    res.render('doctor/editDoctor', { doctor, title: 'Edit Doctor', error: null, doctorData: {} });
}));

// PUT route to update Doctor details
router.put('/:id', authMiddle, upload.single('image'), validateEditDoctor, wrapAsync(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
        return res.status(404).send('Doctor not found');
    }

    const { name, specialty, experience, consultationType, fee } = req.body;

    // Update doctor details
    doctor.name = name || doctor.name; // Only update if new value is provided
    doctor.specialty = specialty || doctor.specialty;
    doctor.experience = experience || doctor.experience;
    doctor.consultationType = consultationType || doctor.consultationType;
    doctor.fee = fee || doctor.fee;

    // Update image if a new one is uploaded
    if (req.file) {
        doctor.image = `/uploads/${req.file.filename}`;
    }

    // Save updated doctor details
    await doctor.save();
    res.redirect(`/doctors/${doctor._id}`); // Redirect to the doctor's updated profile page
}));

// GET route for Patients of Doctor page
router.get('/:id/patients', authMiddle, wrapAsync(async (req, res) => {
    try {
        const doctorId = req.params.id;

        // Find the doctor by ID
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }

        // Get appointments with this doctor
        const appointments = await Appointment.find({ doctor: doctorId })
            .populate('patient')
            .exec();

        // Filter unique patients by their _id
        const uniquePatientsMap = {};
        appointments.forEach(app => {
            if (app.patient && app.patient._id) {
                uniquePatientsMap[app.patient._id] = app.patient;
            }
        });

        const uniquePatients = Object.values(uniquePatientsMap);

        // Render the Patients of Doctor page
        res.render('doctor/patientsOfDoctor', {
            title: 'Patients of Doctor',
            patients: uniquePatients,
            doctor
        });

    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Server Error');
    }
}));

module.exports = router;
