const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema({
    symptom: { type: String, required: true }, // Single symptom stored
    related_symptoms: [String], // List of associated symptoms
    follow_ups: [
        {
            question: { type: String, required: true }, // Follow-up question
            yes: { type: String, required: true }, // Condition if "yes"
            no: { type: String, required: true } // Condition if "no"
        }
    ],
    possible_conditions: [
        {
            condition: { type: String, required: true }, // Disease/condition name
            severity: { type: String, enum: ["Mild", "Moderate", "Severe"] }, // Condition severity
            recommended_specialist: [String], // Suggested doctors
            treatment: [String], // Suggested treatments or remedies
            is_emergency: { type: Boolean, default: false } // 🚨 NEW FIELD: Mark emergency cases
        }
    ]
});

module.exports = mongoose.model("Symptom", symptomSchema);
