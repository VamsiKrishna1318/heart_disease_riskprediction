const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch(
      "https://heart-disease-riskprediction.onrender.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    const resultCode = data.result_code;

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
      speakResult("Warning! High risk of heart disease detected.");
    } else {
      speakResult("Good news! Low risk of heart disease.");
    }
  } catch (error) {
    console.error("Prediction error:", error);
    setLoading(false);
    alert("Unable to connect to the prediction server.");
  }
};
export default App;
