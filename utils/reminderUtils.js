require("dotenv").config(); // Load environment variables
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Store in `.env` file
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send Email Reminder
 * @param {string} email - Patient's email
 * @param {object} appointment - Appointment details
 */
const sendReminder = async (email, appointment) => {
  const mailOptions = {
    from: `"DocOnTime" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Appointment Reminder - DocOnTime",
    html: `
      <h3>Dear Patient,</h3>
      <p>This is a reminder that you have an appointment scheduled for <b>${new Date(appointment.date).toLocaleString()}</b>.</p>
      <p>Please be ready for your consultation.</p>
      <br>
      <p>Best Regards,</p>
      <p><b>DocOnTime Team</b></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email reminder sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error);
  }
};

module.exports = sendReminder;


