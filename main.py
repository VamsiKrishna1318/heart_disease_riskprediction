from flask import Flask, request, jsonify
from flask_cors import CORS
from waitress import serve
import joblib
import pandas as pd

# -----------------
# 1. APP INITIALIZATION
# -----------------
app = Flask(__name__)
# Allow frontend to talk to backend
CORS(app)

# -----------------
# 2. MODEL AND DATA SETUP
# -----------------
# Load model (make sure 'heart_model.pkl' is in the same directory)
try:
    # Use joblib.load to load the model
    model = joblib.load("heart_model.pkl") 
except FileNotFoundError:
    print("Error: heart_model.pkl not found. Please ensure it is in the same directory.")
    model = None

# Define feature columns (must match training data order)
FEATURES = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
            'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']

# -----------------
# 3. API ENDPOINTS
# -----------------

# The main endpoint (your homepage)
@app.route("/", methods=["GET"])
def home():
    # This route is usually just a check or returns the HTML if not served by the frontend
    return "Hello, this is the heart disease prediction API home page. Backend is running."

# The prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Check server logs."}), 500

    try:
        # Get JSON data from the request
        data = request.get_json(force=True)
        
        # Create a DataFrame from the received data to match the model's input
        # Note: data should be a dictionary with keys matching the FEATURES list
        input_data = pd.DataFrame([data], columns=FEATURES)

        # Make prediction
        prediction_result = model.predict(input_data)
        
        # Convert prediction result to a readable format
        prediction_text = "The person has heart disease." if prediction_result[0] == 1 else "The person does not have heart disease."

        # Return the prediction result as JSON
        return jsonify({"prediction": prediction_text, "result_code": int(prediction_result[0])})
        
    except Exception as e:
        # Handle cases where input data is incorrect or other errors occur
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 400

# -----------------
# 4. SERVER DEPLOYMENT
# -----------------
if __name__ == "__main__":
    print("Starting Waitress server on http://0.0.0.0:5000")
    # This starts the production-ready WSGI server
    serve(app, host="0.0.0.0", port=5000)