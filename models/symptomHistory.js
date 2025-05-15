const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
        {
            sender: { type: String, enum: ["user", "doctor"], required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    corrections: [{ original: String, corrected: String }]

});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);