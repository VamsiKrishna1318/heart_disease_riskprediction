# Import libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Load dataset
heart_data = pd.read_csv("heart.csv")  # ensure file is in same folder

# Quick exploration
print(heart_data.head())
print(heart_data.shape)
print(heart_data.info())
print(heart_data.isnull().sum())
print(heart_data.describe())
print(heart_data['target'].value_counts())  # 1=heart disease, 0=healthy

# Features and target
x = heart_data.drop(columns='target', axis=1)
y = heart_data['target']

# Train/test split
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, stratify=y, random_state=2)

# Model
model = LogisticRegression(max_iter=1000)  # increase iterations to avoid convergence warnings
model.fit(x_train, y_train)

# Accuracy
x_train_prediction = model.predict(x_train)
training_data_accuracy = accuracy_score(x_train_prediction, y_train)
print('Accuracy on training data:', training_data_accuracy)

x_test_prediction = model.predict(x_test)
test_data_accuracy = accuracy_score(x_test_prediction, y_test)
print('Accuracy on test data:', test_data_accuracy)

# Prediction on sample input
input_data = (41,0,1,130,204,0,0,172,0,1.4,2,0,2)  # sample patient
input_data_as_numpy_array = np.asarray(input_data).reshape(1, -1)
prediction = model.predict(input_data_as_numpy_array)

if prediction[0] == 0:
    print('The person does not have heart disease')
else:
    print('The person has heart disease')
