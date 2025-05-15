import json
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Hugging Face API setup
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
API_TOKEN = os.getenv("Hugging_FACE_API_KEY")
if not API_TOKEN:
    raise ValueError("Hugging Face API token not found. Set the 'Hugging_FACE_API_KEY' in .env file.")
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}

# Emergency symptoms list
EMERGENCY_SYMPTOMS = {
    "chest pain": "🚨 Emergency Detected! Your symptoms suggest a possible heart attack. Seek immediate medical attention!",
    "difficulty breathing": "🚨 Urgent Attention Required! Call 911 immediately.",
    "severe headache": "🚨 This could be linked to serious conditions like a stroke. Seek immediate care!",
    "loss of consciousness": "🚨 Critical condition detected! Call emergency services now.",
    "uncontrolled bleeding": "🚨 Urgent medical attention required! Apply pressure and call for help.",
    "severe allergic reaction": "🚨 Possible anaphylaxis! Use epinephrine if available and call 911."
}

def extract_symptoms(user_input):
    """
    Extracts symptoms or keywords from user input.
    """
    symptoms = []
    user_input_lower = user_input.lower()

    # Add known emergency symptoms
    for symptom in EMERGENCY_SYMPTOMS:
        if symptom in user_input_lower:
            symptoms.append(symptom)

    # Clean and split words as fallback
    cleaned = user_input_lower.replace(",", "").replace(".", "")
    words = cleaned.split()

    return symptoms if symptoms else words

def match_symptom(user_input, symptom_list):
    """
    Match user input to a known symptom from the list.
    """
    user_input_lower = user_input.lower()
    for known_symptom in symptom_list:
        if known_symptom.lower() in user_input_lower or user_input_lower in known_symptom.lower():
            return known_symptom
    return None

def generate_response(symptom, conditions, follow_up, past_messages):
    """
    Generates doctor-like response from AI model.
    """
    if not symptom.strip():
        return "Could you describe your symptoms in more detail?"

    history_text = " ".join([msg["text"] for msg in past_messages[-5:]])

    # Emergency symptom shortcut
    if symptom.lower() in EMERGENCY_SYMPTOMS:
        return EMERGENCY_SYMPTOMS[symptom.lower()]

    prompt = (
        f"You are a professional AI doctor. The patient says: '{symptom}'. "
        f"Based on recent chat history: '{history_text}' and suspected conditions: {conditions}, "
        "please reply in a structured, conversational, and empathetic tone. Include follow-up questions if necessary."
    )

    try:
        response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})
        response.raise_for_status()
        result = response.json()

        if isinstance(result, list) and len(result) > 0:
            return result[0]["generated_text"]
        else:
            return "I'm sorry, I couldn't understand that. Could you describe your symptoms again?"
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Hugging Face API: {e}")
        return "I'm having trouble processing your request. Please try again later."
