const axios = require("axios");
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'models/gemini-1.5-pro-002';

async function fetchAIResponse(userInput) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: userInput }] }]
            }
        );

        let aiResponse = response.data?.candidates?.[0]?.content?.parts?.map(part => part.text).join(" ") || 
                         "I'm sorry, I couldn't process your request.";

        const match = aiResponse.match(/Possible Condition: (.+?)\nSeverity: (.+?)\nSuggested Action: (.+?)\n?(Recommended Medicine: (.+?))?\n?(Home Remedies: (.+?))?\n?(Red Flag Symptoms: (.+?))?/);

        if (match) {
            aiResponse = `Possible Condition: ${match[1].trim()}
Severity: ${match[2].trim()}
Suggested Action: ${match[3].trim()}`;

            if (match[5]) aiResponse += `\nRecommended Medicine: ${match[5].trim()}`;
            if (match[7]) aiResponse += `\nHome Remedies: ${match[7].trim()}`;
            if (match[9]) aiResponse += `\n🚨 Red Flag Symptoms: ${match[9].trim()}`;
        } else {
            aiResponse = "I'm sorry, I couldn't determine the condition accurately.";
        }

        console.log("✅ AI Final Response:", aiResponse);
        return aiResponse.trim();
    } catch (error) {
        console.error("❌ AI API Error:", error.response?.data || error.message);
        return "I'm sorry, something went wrong while processing your request.";
    }
}



module.exports = { fetchAIResponse };



