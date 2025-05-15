const express = require('express');
const router = express.Router();
const authMiddle = require('../middleware/authMiddle');
const axios = require("axios");
const wrapAsync = require('../utils/wrapAsync');
const underConstruction = require('../middleware/underConstruction');

// Render Symptom Checker Page
router.get('/', authMiddle,underConstruction, (req, res) => {
    res.render('main/symptomChecker', { title: 'AI Symptom Checker' });
});

// Handle Chatbot request
router.post("/chatbot", authMiddle,underConstruction, wrapAsync(async (req, res) => {
    try {
        const { user_id, symptom } = req.body;

        const AI_API_URL = process.env.AI_API_URL || "http://localhost:8010/chatbot";

        console.log("Forwarding to:", AI_API_URL);
        console.log("Payload:", { user_id, symptom });

        const response = await axios.post(
            AI_API_URL,
            { user_id, symptom },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("AI Response:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error connecting to AI API:", error.message);

        if (!res.headersSent) {
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
                res.status(error.response.status).json({ error: error.response.data });
            } else if (error.request) {
                console.error("No response received from AI API.");
                res.status(500).json({ error: "AI chatbot service is unavailable" });
            } else {
                console.error("Axios Error:", error.message);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
}));

module.exports = router;
