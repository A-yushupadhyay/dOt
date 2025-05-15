const mongoose = require("mongoose");
const Appointment = require("./models/appointment");

// Connect to MongoDB
const MONGOURL = 'mongodb://127.0.0.1:27017/docONtime'
main()
 .then(()=>{
    console.log("connected to DB");
 })
 .catch((err)=>{
    console.log(err);
 });
 async function main(){
    await mongoose.connect(MONGOURL);
 }


async function migrateAppointments() {
  try {
    const result = await Appointment.updateMany(
      { meetingType: { $exists: false } }, // Only update documents missing this field
      {
        $set: {
          meetingType: "offline", // Default to offline
          status: "upcoming", // Ensure status field exists
          reminderSent: false, // Set default reminder status
        },
      }
    );

    console.log(`Migration complete. Updated ${result.nModified} records.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Migration failed:", error);
    mongoose.connection.close();
  }
}

migrateAppointments();
