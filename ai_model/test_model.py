import joblib

# Load Trained Model
model = joblib.load("ai_symptom_checker.pkl")
vectorizer = joblib.load("vectorizer.pkl")

def predict_disease(symptom):
    symptom_vector = vectorizer.transform([symptom])
    prediction = model.predict(symptom_vector)
    return prediction[0]

# Test with an example symptom
symptom_input = "fever"
predicted_disease = predict_disease(symptom_input)
print(f"Predicted Disease for '{symptom_input}': {predicted_disease}")
