from flask import Flask, request, jsonify, render_template
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import os

app = Flask(__name__)

# Load model
model = load_model("best_model.keras")

class_labels = ['Early Blight', 'Late Blight', 'Healthy']


def preprocess_image(img_path):
    img = load_img(img_path, target_size=(300, 300))
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = tf.keras.applications.efficientnet.preprocess_input(img)
    return img


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']

    os.makedirs("uploads", exist_ok=True)
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    img = preprocess_image(filepath)
    prediction = model.predict(img)

    class_index = np.argmax(prediction)
    result = class_labels[class_index]
    confidence = float(np.max(prediction))

    return jsonify({
        "class": result,
        "confidence": confidence
    })


if __name__ == "__main__":
    app.run(debug=True)