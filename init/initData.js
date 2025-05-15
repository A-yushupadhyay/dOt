const mongoose = require('mongoose');
const Doctor = require('../models/doctor');
const MONGOURL = 'mongodb://127.0.0.1:27017/docONtime';
const Appointment = require('../models/appointment');
const User = require('../models/user'); // Assuming you have a User model

async function main() {
   await mongoose.connect(MONGOURL);
   console.log("Connected to DB");
 
   // Clear previous records
   await Doctor.deleteMany({});
   await User.deleteMany({ email: { $in: ["ayush.sharma@example.com", "priya.verma@example.com", "rahul.singh@example.com"] } });
 
   // Step 1: Create sample users (with 'doctor' role)
   const users = await User.insertMany([
     { name: "Dr. Ayush Sharma", email: "ayush.sharma@example.com", password: "hashedPassword1", role: "doctor" },
     { name: "Dr. Priya Verma", email: "priya.verma@example.com", password: "hashedPassword2", role: "doctor" },
     { name: "Dr. Rahul Singh", email: "rahul.singh@example.com", password: "hashedPassword3", role: "doctor" }
   ]);
 
   // Step 2: Match doctors to their respective user IDs
   const sampleDoctors = [
     {
       name: "Dr. Ayush Sharma",
       email: "ayush.sharma@example.com",
       phone: "9876543210",
       specialty: "Cardiology",
       experience: 10,
       consultationType: "in-person",
       fee: 500,
       availableSlots: [
         new Date("2025-02-23T10:00:00Z"),
         new Date("2025-02-23T14:00:00Z")
       ],
       user: users[0]._id
     },
     {
       name: "Dr. Priya Verma",
       email: "priya.verma@example.com",
       phone: "9898989898",
       specialty: "Dermatology",
       experience: 8,
       consultationType: "video",
       fee: 300,
       availableSlots: [
         new Date("2025-02-24T11:30:00Z"),
         new Date("2025-02-25T15:00:00Z")
       ],
       user: users[1]._id
     },
     {
       name: "Dr. Rahul Singh",
       email: "rahul.singh@example.com",
       phone: "9765432100",
       specialty: "Orthopedics",
       experience: 12,
       consultationType: "in-person",
       fee: 700,
       availableSlots: [
         new Date("2025-02-26T09:00:00Z"),
         new Date("2025-02-27T13:30:00Z")
       ],
       user: users[2]._id
     }
   ];
 
   // Step 3: Add doctors
   await Doctor.insertMany(sampleDoctors);
   console.log("Sample doctors with linked users added!");
 
   mongoose.connection.close();
 }
 
 main().catch(err => console.error(err));

// ✅ Correct import of ObjectId
// const ObjectId = mongoose.Types.ObjectId;

// async function createTestAppointment() {
//   // await mongoose.connect("mongodb://localhost:27017/your_database_name");

//   const tenMinutesLater = new Date(new Date().getTime() + 11 * 60000); // 11 min later

//   const testAppointment = new Appointment({
//     patient: new ObjectId('67cf02dc5490db565b3e275f'), // Convert to ObjectId,  // Replace with actual patient ID
//     doctor:  new ObjectId('67bf4c87676e2c09e316b7c1'),  // Replace with actual doctor ID
//     date: tenMinutesLater,                // Set it to 9 minutes from now
//     status: "confirmed",
//     payment: { orderId: "123456", status: "paid" },
//     isVideoCall: false,
//     reminderSent: false
//   });

//   await testAppointment.save();
//   console.log("✅ Test appointment created:", testAppointment);
//   process.exit(); // Exit script
// }

// createTestAppointment();