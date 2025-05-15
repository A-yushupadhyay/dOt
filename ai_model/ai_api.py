from fastapi import FastAPI, HTTPException
import pymongo
from pydantic import BaseModel
import json
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from nlp_engine import extract_symptoms, match_symptom, generate_response

# Ensure directory for chat logs
os.makedirs("training_data", exist_ok=True)
chat_logs_path = "training_data/chat_logs.json"
if not os.path.exists(chat_logs_path):
    with open(chat_logs_path, "w") as f:
        json.dump([], f)

# Load environment variables
load_dotenv()

# MongoDB Connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["docONtime"]
chat_history_collection = db["chathistories"]
symptoms_collection = db["symptoms"]

# FastAPI app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input Schema
class SymptomInput(BaseModel):
    user_id: str
    symptom: str

@app.post("/chatbot")
async def chatbot(input_data: SymptomInput):
    user_id = input_data.user_id
    symptom = input_data.symptom.lower()

    extracted_symptoms = extract_symptoms(symptom)
    if not extracted_symptoms:
        return {"status": "ERROR", "message": "I couldn't understand your symptoms. Could you describe them in more detail?"}

    detected_conditions = []
    emergency_detected = False
    follow_up_questions = []

    # Try direct match
    symptom_entry = symptoms_collection.find_one({
        "symptom": {"$regex": f"{symptom}", "$options": "i"}
    })

    # Try fuzzy match using extracted keywords
    if not symptom_entry:
        all_symptoms = [entry["symptom"] for entry in symptoms_collection.find({}, {"symptom": 1})]
        for keyword in extracted_symptoms:
            matched_symptom = match_symptom(keyword, all_symptoms)
            if matched_symptom:
                symptom_entry = symptoms_collection.find_one({"symptom": matched_symptom})
                break

    if not symptom_entry:
        raise HTTPException(status_code=404, detail="Symptom not found in database.")

    # Detect conditions
    for condition in symptom_entry.get("possible_conditions", []):
        detected_conditions.append({
            "condition": condition["condition"],
            "severity": condition.get("severity", "Mild"),
            "is_emergency": condition.get("is_emergency", False)
        })
        if condition.get("is_emergency", False):
            emergency_detected = True
            break

    if emergency_detected:
        return {
            "status": "EMERGENCY",
            "message": (
                "🚨 Emergency Detected! Your symptoms suggest a serious medical condition. Please seek immediate medical help!\n\n"
                "**Immediate Actions:**\n"
                "• Call 911 or go to the nearest emergency room.\n"
                "• Stay calm and avoid physical exertion.\n"
                "• If available, chew aspirin (unless allergic).\n"
                "• Do not delay—this could be life-threatening!"
            ),
            "detected_conditions": detected_conditions
        }

    # Retrieve chat history
    history = chat_history_collection.find_one({"user_id": user_id})
    past_messages = history["messages"] if history else []

    # Generate AI response
    doctor_reply = generate_response(symptom, detected_conditions, follow_up_questions, past_messages)

    # Save chat history
    new_message = {"sender": "user", "text": symptom}
    new_response = {"sender": "doctor", "text": doctor_reply}

    if history:
        chat_history_collection.update_one(
            {"user_id": user_id}, {"$push": {"messages": {"$each": [new_message, new_response]}}}
        )
    else:
        chat_history_collection.insert_one({"user_id": user_id, "messages": [new_message, new_response]})

    return {
        "status": "OK",
        "doctor_reply": doctor_reply,
        "detected_conditions": detected_conditions,
        "follow_up_questions": follow_up_questions
    }
