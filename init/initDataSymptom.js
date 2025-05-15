const mongoose = require('mongoose');
const SymptomModel = require('../models/symptomModel');
const MONGOURL = 'mongodb://127.0.0.1:27017/docONtime';



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





    const sampleSymptoms = [
        {
          "symptom": "Fever",
          "related_symptoms": ["Chills", "Sweating", "Body Ache"],
          "follow_ups": [
            {
              "question": "Do you have a high fever above 102°F?",
              "yes": "Possible infection, seek medical advice",
              "no": "Monitor and stay hydrated"
            },
            {
              "question": "Do you have a sore throat along with fever?",
              "yes": "Possible strep throat or viral infection",
              "no": "Monitor for additional symptoms"
            }
          ],
          "possible_conditions": [
            {
              "condition": "Viral Infection",
              "severity": "Mild",
              "recommended_specialist": ["General Physician"],
              "treatment": ["Rest", "Hydration", "Paracetamol"]
            },
            {
              "condition": "Bacterial Infection",
              "severity": "Moderate",
              "recommended_specialist": ["Infectious Disease Specialist"],
              "treatment": ["Antibiotics", "Hydration", "Rest"]
            }
          ]
        },
        {
          "symptom": "Cough",
          "related_symptoms": ["Sore Throat", "Runny Nose", "Chest Congestion"],
          "follow_ups": [
            {
              "question": "Is the cough dry or with mucus?",
              "yes": "Possible viral infection",
              "no": "Could be allergy or asthma-related"
            },
            {
              "question": "Do you have shortness of breath along with cough?",
              "yes": "Possible pneumonia or bronchitis",
              "no": "Monitor and stay hydrated"
            }
          ],
          "possible_conditions": [
            {
              "condition": "Common Cold",
              "severity": "Mild",
              "recommended_specialist": ["General Physician"],
              "treatment": ["Cough syrup", "Rest", "Steam inhalation"]
            },
            {
              "condition": "Bronchitis",
              "severity": "Moderate",
              "recommended_specialist": ["Pulmonologist"],
              "treatment": ["Antibiotics (if bacterial)", "Cough suppressants"]
            }
          ]
        },
        {
          "symptom": "Chest Pain",
          "related_symptoms": ["Shortness of Breath", "Fatigue", "Dizziness"],
          "follow_ups": [
            {
              "question": "Is the chest pain severe and sudden?",
              "yes": "Seek emergency medical attention",
              "no": "Monitor and check for other symptoms"
            },
            {
              "question": "Does the pain increase with exertion?",
              "yes": "Possible heart-related issue",
              "no": "Could be muscle-related pain"
            }
          ],
          "possible_conditions": [
            {
              "condition": "Heart Attack",
              "severity": "Severe",
              "recommended_specialist": ["Cardiologist"],
              "treatment": ["Emergency care", "Aspirin", "Hospitalization"]
            },
            {
              "condition": "Muscle Strain",
              "severity": "Mild",
              "recommended_specialist": ["Orthopedic Doctor"],
              "treatment": ["Rest", "Pain relievers", "Stretching exercises"]
            }
          ]
        },
        {
          "symptom": "Headache",
          "related_symptoms": ["Dizziness", "Nausea", "Blurred Vision"],
          "follow_ups": [
            {
              "question": "Is the headache severe and persistent?",
              "yes": "Possible migraine or cluster headache",
              "no": "Could be stress-related"
            },
            {
              "question": "Do you have sensitivity to light and sound?",
              "yes": "Possible migraine",
              "no": "Could be due to dehydration or stress"
            }
          ],
          "possible_conditions": [
            {
              "condition": "Migraine",
              "severity": "Moderate",
              "recommended_specialist": ["Neurologist"],
              "treatment": ["Pain relievers", "Rest in a dark room", "Hydration"]
            },
            {
              "condition": "Tension Headache",
              "severity": "Mild",
              "recommended_specialist": ["General Physician"],
              "treatment": ["Painkillers", "Stress reduction techniques", "Proper sleep"]
            }
          ]
        },
        {
          "symptom": "Diarrhea",
          "related_symptoms": ["Stomach Pain", "Dehydration", "Fatigue"],
          "follow_ups": [
            {
              "question": "Do you have blood in stool?",
              "yes": "Seek immediate medical attention",
              "no": "Possible viral or bacterial infection"
            },
            {
              "question": "Have you recently eaten outside food?",
              "yes": "Possible food poisoning",
              "no": "Monitor hydration levels"
            }
          ],
          "possible_conditions": [
            {
              "condition": "Food Poisoning",
              "severity": "Mild",
              "recommended_specialist": ["General Physician"],
              "treatment": ["Oral rehydration", "Rest", "Light diet"]
            },
            {
              "condition": "Bacterial Infection",
              "severity": "Moderate",
              "recommended_specialist": ["Gastroenterologist"],
              "treatment": ["Antibiotics", "Hydration therapy"]
            }
          ]
        },
        {
          "symptom": "Dizziness",
          "related_symptoms": ["Nausea", "Blurred Vision", "Fatigue"],
          "follow_ups": [
            {
              "question": "Do you feel like fainting?",
              "yes": "Seek immediate medical attention",
              "no": "Monitor for underlying causes"
            },
            {
              "question": "Did you recently have low food intake?",
              "yes": "Possible low blood sugar",
              "no": "Could be dehydration or low blood pressure"
            }
          ],
          "possible_conditions": [
            {
              "condition": "Low Blood Pressure",
              "severity": "Moderate",
              "recommended_specialist": ["Cardiologist"],
              "treatment": ["Increase fluid intake", "Salt consumption"]
            },
            {
              "condition": "Vertigo",
              "severity": "Mild",
              "recommended_specialist": ["ENT Specialist"],
              "treatment": ["Balance exercises", "Medications if persistent"]
            }
          ]
        },
        {
          "symptom": "Joint Pain",
          "related_symptoms": ["Swelling", "Stiffness", "Redness"],
          "follow_ups": [
            {
              "question": "Is the pain persistent for more than a week?",
              "yes": "Possible arthritis",
              "no": "Could be a temporary strain"
            },
            {
              "question": "Is there swelling in joints?",
              "yes": "Possible inflammation or gout",
              "no": "Monitor for additional symptoms"
            }
          ],
          "possible_conditions": [
            {
              "condition": "Osteoarthritis",
              "severity": "Moderate",
              "recommended_specialist": ["Orthopedic Doctor"],
              "treatment": ["Pain relievers", "Physical therapy", "Weight management"]
            },
            {
              "condition": "Gout",
              "severity": "Mild",
              "recommended_specialist": ["Rheumatologist"],
              "treatment": ["Diet control", "Anti-inflammatory medications"]
            }
          ]
        }
      ]
      

 



const seedDatabase= async () => {
  await SymptomModel.deleteMany({});
  await SymptomModel.insertMany(sampleSymptoms);
  console.log("Sample of Symptom successfully added!");
  mongoose.connection.close();
};

seedDatabase();

// Connect to MongoDB and seed data
