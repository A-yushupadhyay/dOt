const Joi = require("joi");

// ✅ Signup Schema
const signupSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 50 characters"
  }),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address"
  }),
  password: Joi.string().min(6).max(1024).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  }),
  role: Joi.string().valid("patient", "doctor").required().messages({
    "any.only": "Role must be either 'patient' or 'doctor'",
    "string.empty": "Please select a role"
  })
});

// ✅ Login Schema
const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required"
  })
});

// ✅ Doctor Profile Creation Schema
const doctorSchema = Joi.object({
  doctor: Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Doctor name is required"
    }),
    email: Joi.string().trim().email().required().messages({
      "string.empty": "Doctor email is required",
      "string.email": "Please enter a valid email"
    }),
    phone: Joi.string().pattern(/^\d{10}$/).required().messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be 10 digits"
    }),
    specialty: Joi.string().trim().required().messages({
      "string.empty": "Specialty is required"
    }),
    experience: Joi.number().min(0).required().messages({
      "number.base": "Experience must be a number",
      "number.min": "Experience must be 0 or more",
      "any.required": "Experience is required"
    }),
    consultationType: Joi.string().valid("in-person", "video").required().messages({
      "any.only": "Consultation type must be 'in-person' or 'video'",
      "string.empty": "Consultation type is required"
    }),
    fee: Joi.number().min(0).required().messages({
      "number.base": "Fee must be a number",
      "number.min": "Fee must be 0 or more",
      "any.required": "Consultation fee is required"
    }),
    availableSlots: Joi.array().items(Joi.date()).optional(),
    image: Joi.string().allow("", null)
  }).required()
});

const addDoctorSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Doctor name is required",
    "string.min": "Doctor name must be at least 3 characters"
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format"
  }),
  phone: Joi.string().pattern(/^\d{10}$/).required().messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be 10 digits"
  }),
  specialty: Joi.string().required().messages({
    "string.empty": "Specialty is required"
  }),
  consultationType: Joi.string().valid("in-person", "video").required().messages({
    "any.only": "Consultation type must be either 'in-person' or 'video'",
    "string.empty": "Consultation type is required"
  }),
  experience: Joi.number().min(0).required().messages({
    "number.base": "Experience must be a number",
    "number.min": "Experience must be 0 or more",
    "any.required": "Experience is required"
  }),
  fee: Joi.number().min(0).required().messages({
    "number.base": "Fee must be a number",
    "number.min": "Fee must be 0 or more",
    "any.required": "Consultation fee is required"
  }),
  availableSlots: Joi.array().items(Joi.date()).messages({
    "array.base": "Available slots must be a list of valid dates"
  }),
  bio: Joi.string().allow("", null).messages({
    "string.base": "Bio must be text"
  })
});


// Used in flat form body parsing (like req.body.name, req.body.email etc)
const editDoctorSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Doctor name is required",
    "string.min": "Doctor name must be at least 3 characters"
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format"
  }),
  phone: Joi.string().pattern(/^\d{10}$/).required().messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be 10 digits"
  }),
  specialty: Joi.string().required().messages({
    "string.empty": "Specialty is required"
  }),
  consultationType: Joi.string().valid("in-person", "video").required().messages({
    "any.only": "Consultation type must be either 'in-person' or 'video'",
    "string.empty": "Consultation type is required"
  }),
  experience: Joi.number().min(0).required().messages({
    "number.base": "Experience must be a number",
    "number.min": "Experience must be 0 or more",
    "any.required": "Experience is required"
  }),
  fee: Joi.number().min(0).required().messages({
    "number.base": "Fee must be a number",
    "number.min": "Fee must be 0 or more",
    "any.required": "Consultation fee is required"
  }),
  availableSlots: Joi.alternatives().try(
    Joi.array().items(Joi.date()),
    Joi.string().allow('', null)
  ).optional(),
   // will be parsed from frontend as JSON string or left empty
  bio: Joi.string().allow("", null).messages({
    "string.base": "Bio must be text"
  })
});

// ✅ Appointment Booking Schema
const appointmentSchema = Joi.object({
  appointment: Joi.object({
    doctorId: Joi.string().required().messages({
      "string.empty": "Doctor ID is required"
    }),
    date: Joi.date().required().messages({
      "date.base": "Please select a valid date"
    }),
    isVideoCall: Joi.boolean().optional()
  }).required()
});


module.exports = {
  signupSchema,
  loginSchema,
  appointmentSchema,
  addDoctorSchema,
  editDoctorSchema
};