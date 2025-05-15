import pymongo
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
import joblib  # To save the trained model

# ✅ Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")  # Change if using a different port
db = client["docONtime"]  # Replace with your actual DB name
collection = db["symptoms"]  # Collection name

# ✅ Fetch data from MongoDB
data = list(collection.find({}, {"_id": 0, "symptom": 1, "possible_conditions.condition": 1}))  # Get only symptoms and conditions

# ✅ Convert to DataFrame
df = pd.DataFrame(data)

# ✅ Data Preprocessing
df.dropna(inplace=True)  # Remove empty rows

# Convert symptoms to a list of words for training
X = df["symptom"]
y = df["possible_conditions"].apply(lambda x: x[0]['condition'] if isinstance(x, list) and x else "Unknown")
 # Take first condition

# Convert text symptoms into numerical vectors
vectorizer = CountVectorizer()
X_vectors = vectorizer.fit_transform(X)

# ✅ Split Data (Train/Test)
X_train, X_test, y_train, y_test = train_test_split(X_vectors, y, test_size=0.2, random_state=42)

# ✅ Train AI Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ✅ Save the Model & Vectorizer
joblib.dump(model, "ai_symptom_checker.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("✅ Model training complete! AI is now ready to predict diseases.")
