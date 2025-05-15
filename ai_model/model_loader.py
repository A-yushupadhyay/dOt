import pickle

def load_model():
    with open("saved_model/symptom_checker.pkl", "rb") as file:
        model = pickle.load(file)
    return model