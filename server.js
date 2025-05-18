require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const engine = require("ejs-mate");
const axios = require("axios");







//  Security & Middleware Setup 
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.set('trust proxy', true);




// Route Imports 
const AuthUser = require("./routes/authRoutes");
const addDoctor = require("./routes/addDoctor");
const appRoute = require("./routes/appointmentRoutes");
const paymentRoute = require("./routes/paymentRoutes");
const vedioRoute = require("./routes/vedioRoute");
const symptomCheckerRoutes = require("./routes/symptomChecker");
const patientRoutes = require("./routes/patientRoute");
const basicRoutes = require("./routes/basicRoutes");
const navRoutes = require("./routes/navRoutes");
const footerRoutes = require("./routes/footer");

const AppError = require("./utils/AppError");






//  Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
   app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
         return res.redirect('https://' + req.headers.host + req.url);
      }
      next();
   });
}

//  Global Locals for EJS 
app.use((req, res, next) => {
   res.locals.currentUser = req.user || null; 
   res.locals.showWelcome = !req.cookies.welcomeShown;
   res.locals.hasVideoAppointment = false;
   res.locals.videoCallLink = null;   
   res.locals.title = res.locals.title || 'DocONTime(Doctor)';
   next();
});

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method} | URL: ${req.originalUrl}`);
  next();
});
 



// Routes 

app.use('/', basicRoutes);
app.use('/user', AuthUser);
app.use('/doctors', addDoctor);
app.use('/app', appRoute);
app.use('/app/payment', paymentRoute);
app.use('/vedioCall', vedioRoute);
app.use('/symptom-checker', symptomCheckerRoutes);
app.use('/patients', patientRoutes);
app.use('/nav', navRoutes);
app.use('/footer' , footerRoutes);


// MongoDB Connection 
const MONGOURL = process.env.MONGO_URL;
mongoose.connect(MONGOURL)
   .then(() => console.log("✅ Connected to MongoDB"))
   .catch(err => {
      console.error("❌ DB Connection Failed:", err);
      process.exit(1);
   });

// 404 Handler
app.use((req, res) => {
   if (res.headersSent) return;
   res.status(404).render("error/404", {
     error: 'Page not found'
   });
 });

//  Error Handling Middleware (500) 
app.use((err, req, res, next) => {
   console.error("❌ Unhandled Error:", err);
   if (res.headersSent) return;
   res.status(err.status || 500).render("error/500", { error: err.message || 'Internal Server Error' });
});


//  Start Server 
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
});





module.exports = app;
