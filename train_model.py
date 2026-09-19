import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib


df = pd.read_csv("heart.csv.csv")


X = df.drop(columns="target", axis=1)
y = df["target"]


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=2)


model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)


print("Training Accuracy:", accuracy_score(y_train, model.predict(X_train)))
print("Test Accuracy:", accuracy_score(y_test, model.predict(X_test)))
joblib.dump(model, "heart_model.pkl")
print("Model saved as heart_model.pkl")
