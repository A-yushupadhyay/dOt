const jwt = require("jsonwebtoken");
const Appointment = require("../models/appointment"); 

const updateUserToken = async(res, user) => {
    // console.log("uut   user yeh h " , user);
    const appointment = await Appointment.findOne({ 
        patient: user._id, 
        isVideoCall: true,
        status: "completed"
    });
    // console.log("inside the appointment",appointment);
    const updatedUserData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        hasVideoAppointment: !!appointment, // ✅ True if an appointment exists
        videoCallLink: appointment ? appointment.videoCallLink : null, // ✅ Pass video link if available
    };

    const newToken = jwt.sign(updatedUserData, "secretkey", { expiresIn: "1d" });

    res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

};

module.exports = updateUserToken;
