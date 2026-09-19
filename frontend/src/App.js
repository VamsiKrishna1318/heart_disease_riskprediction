import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const initialState = {
    age: 50,
    sex: "1",
    cp: "0",
    trestbps: 120,
    chol: 200,
    fbs: "0",
    restecg: "1",
    thalach: 150,
    exang: "0",
    oldpeak: 1.0,
    slope: "1",
    ca: "0",
    thal: "2",
  };

  const [formData, setFormData] = useState(initialState);
  const [result, setResult] = useState(null);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("predictionHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("light-mode");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const speakResult = (message) => {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    speech.pitch = 1;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://heart-disease-riskprediction.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            age: Number(formData.age),
            sex: Number(formData.sex),
            cp: Number(formData.cp),
            trestbps: Number(formData.trestbps),
            chol: Number(formData.chol),
            fbs: Number(formData.fbs),
            restecg: Number(formData.restecg),
            thalach: Number(formData.thalach),
            exang: Number(formData.exang),
            oldpeak: Number(formData.oldpeak),
            slope: Number(formData.slope),
            ca: Number(formData.ca),
            thal: Number(formData.thal),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      const resultCode = Number(data.result_code);

      setResult(resultCode);
      setProbability(null);
      setLoading(false);

      const timestamp = new Date().toLocaleString();

      const entry = {
        time: timestamp,
        inputs: { ...formData },
        prediction: resultCode,
        probability: null,
      };

      const updatedHistory = [entry, ...history];

      setHistory(updatedHistory);

      localStorage.setItem(
        "predictionHistory",
        JSON.stringify(updatedHistory)
      );

      if (resultCode === 1) {
        speakResult(
          "Warning! High risk of heart disease detected."
        );
      } else {
        speakResult(
          "Good news! Low risk of heart disease."
        );
      }
    } catch (error) {
      console.error("Prediction error:", error);
      setLoading(false);
      alert(
        "Unable to connect to the prediction server. Please try again."
      );
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setResult(null);
    setProbability(null);
  };

  return (
    <div className="main-container">

      {/* Header */}
      <div className="header">
        <h1>❤️ Heart Disease Risk Predictor</h1>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="form-card"
      >
        <h2>📝 Enter Your Health Details</h2>

        <div className="form-grid">

          <div className="form-group">
            <label>
              Age: {formData.age}
            </label>

            <input
              type="range"
              name="age"
              min="20"
              max="100"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Sex:</label>

            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="1">Male ♂️</option>
              <option value="0">Female ♀️</option>
            </select>
          </div>

          <div className="form-group">
            <label>Chest Pain Type:</label>

            <select
              name="cp"
              value={formData.cp}
              onChange={handleChange}
            >
              <option value="0">
                Typical Angina
              </option>

              <option value="1">
                Atypical Angina
              </option>

              <option value="2">
                Non-anginal Pain
              </option>

              <option value="3">
                Asymptomatic
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Resting BP: {formData.trestbps}
            </label>

            <input
              type="range"
              name="trestbps"
              min="80"
              max="200"
              value={formData.trestbps}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              Cholesterol: {formData.chol}
            </label>

            <input
              type="range"
              name="chol"
              min="100"
              max="400"
              value={formData.chol}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              Max Heart Rate: {formData.thalach}
            </label>

            <input
              type="range"
              name="thalach"
              min="80"
              max="220"
              value={formData.thalach}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              ST Depression: {formData.oldpeak}
            </label>

            <input
              type="range"
              name="oldpeak"
              min="0"
              max="6"
              step="0.1"
              value={formData.oldpeak}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="form-buttons">

          <button
            type="submit"
            className="predict-btn"
            disabled={loading}
          >
            {loading ? "⏳ Analyzing..." : "🔍 Predict"}
          </button>

          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
          >
            🔄 Reset
          </button>

        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="loader">
          ⏳ Analyzing your health...
        </div>
      )}

      {/* Result */}
      {result !== null && !loading && (
        <div
          className={`result-card ${
            result === 1 ? "danger" : "safe"
          }`}
        >
          <h2>
            {result === 1
              ? "⚠️ High Risk of Heart Disease"
              : "✅ Low Risk of Heart Disease"}
          </h2>

          {probability !== null && (
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${(
                    probability * 100
                  ).toFixed(1)}%`,
                  background:
                    result === 1
                      ? "#dc3545"
                      : "#28a745",
                }}
              >
                {(probability * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="history-card">

          <h2>📊 Prediction History</h2>

          <ul>
            {history.map((item, index) => (
              <li
                key={index}
                className={
                  item.prediction === 1
                    ? "danger"
                    : "safe"
                }
              >
                <strong>{item.time}</strong>
                {" → "}

                {item.prediction === 1
                  ? " High Risk of Heart Disease"
                  : " Low Risk of Heart Disease"}

                {item.probability !== null &&
                  item.probability !== undefined && (
                    <>
                      {" "}
                      (
                      {(
                        item.probability * 100
                      ).toFixed(1)}
                      %)
                    </>
                  )}
              </li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
}

export default App;
