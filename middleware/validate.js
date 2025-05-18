const {
  signupSchema,
  loginSchema,
  addDoctorSchema,
  editDoctorSchema
} = require("../utils/schema");
const Doctor = require("../models/doctor");





const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    console.log("Validation Error:", error);
    console.log("Request Body in middleware of schema:", req.body);
    console.log("i am in validateSchema");

    if (error) {
      const errors = {};
      error.details.forEach(e => {
        errors[e.path[0]] = e.message;
      });

      const view = req.originalUrl.includes('/register') ? 'signup' : 'login';

      return res.status(400).render(`Auth/${view}`, {
        errors,
        oldInput: req.body,
        currentUser: req.user || res.locals.currentUser || null
      });
    }

    next();
  };
};



const validateAddDoctor = (req, res, next) => {
  console.log("Request Body in validateAddDoctor:", req.body);
  console.log("i am in validateAddDoctor");
  if (typeof req.body.availableSlots === 'string') {
    req.body.availableSlots = JSON.parse(req.body.availableSlots);
  }
  const { error } = addDoctorSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).render("doctor/doctor", {
      title: "Add Doctor",
      error: error.details[0].message,
      doctorData: req.body  // ✅ makes EJS values work
    });
  }
  next();
};

const validateEditDoctor = async (req, res, next) => {


  const { error } = editDoctorSchema.validate(req.body);

  if (error) {
    try {
      const doctor = await Doctor.findById(req.params.id);

      return res.status(400).render("doctor/editDoctor", {
        title: "Edit Doctor",
        doctor,
        error: error.details[0].message,
        formData: req.body, // optional if you want to reuse input
      });
    } catch (fetchError) {
      return res.status(500).send("Internal Server Error");
    }
  }

  next();
};
//  Correctly export all middleware in one go
module.exports = {
  validateSchema,
  validateAddDoctor,
  validateEditDoctor,
};
