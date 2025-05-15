const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to Users collection // Unique identifier for the user
    messages: [
        {
            sender: { type: String, enum: ["user", "doctor"], required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
