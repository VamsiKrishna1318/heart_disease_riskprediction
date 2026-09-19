from flask import Flask, request, jsonify
from flask_cors import CORS
from waitress import serve
import joblib
import pandas as pd
import os

# -----------------
# 1. APP INITIALIZATION
# -----------------
app = Flask(__name__)

# Allow frontend to talk to backend
CORS(app)

# -----------------
# 2. MODEL AND DATA SETUP
# -----------------
# Load model from the same directory as this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "heart_model.pkl")

try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    print("Error: heart_model.pkl not found. Please ensure it is in the same directory.")
    model = None

# Define feature columns (must match training data order)
FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]

# -----------------
# 3. API ENDPOINTS
# -----------------

# The main endpoint
@app.route("/", methods=["GET"])
def home():
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
        input_data = pd.DataFrame([data], columns=FEATURES)

        # Make prediction
        prediction_result = model.predict(input_data)

        # Convert prediction result to a readable format
        prediction_text = (
            "The person has heart disease."
            if prediction_result[0] == 1
            else "The person does not have heart disease."
        )

        # Return the prediction result as JSON
        return jsonify({
            "prediction": prediction_text,
            "result_code": int(prediction_result[0])
        })

    except Exception as e:
        return jsonify({
            "error": f"An error occurred during prediction: {str(e)}"
        }), 400


# -----------------
# 4. SERVER DEPLOYMENT
# -----------------
if __name__ == "__main__":
    # Render provides the PORT environment variable.
    # Use 5000 as the default for local development.
    port = int(os.environ.get("PORT", 5000))

    print(f"Starting Waitress server on http://0.0.0.0:{port}")
    serve(app, host="0.0.0.0", port=port)
