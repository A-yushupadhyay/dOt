const cron = require("node-cron");
const Appointment = require("../models/appointment");
const sendReminder = require("../utils/reminderutils");
const { io } = require("../app");

cron.schedule("*/5 * * * *", async () => { // Runs every 5 mins (better than every 1 min)
  try {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60000);

    // Fetch appointments in one query
    const appointments = await Appointment.find({
      date: { $lte: tenMinutesLater, $gte: now },
      reminderSent: false,
    }).populate("patient", "email name").populate("doctor", "name"); // Fetch only necessary fields

    if (appointments.length === 0) return; // No reminders needed

    // Process appointments concurrently using Promise.all()
    await Promise.all(appointments.map(async (appointment) => {
      if (!appointment.patient || !appointment.patient.email) return;


      const videoCallURL = appointment.videoCallLink;

      // Send real-time notification
       // Send real-time notification to frontend
       io.emit("reminder", {
        doctorName: appointment.doctor.name,
        message: `Your appointment with Dr. ${appointment.doctor.name} is in 10 minutes!`,
        appointment: { id: appointment._id, date: appointment.date },
        videoCallURL: videoCallURL,
      });

      // Send email reminder
      await sendReminder(appointment.patient.email, appointment);

      // Mark reminder as sent
      await Appointment.updateOne({ _id: appointment._id }, { reminderSent: true });
    }));

    console.log(`✅ Reminders sent for ${appointments.length} appointments.`);
  } catch (error) {
    console.error("❌ Error in reminder job:", error);
  }
});
