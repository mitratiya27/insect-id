import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Reverting to MobileNetV2 because ResNet50 is too heavy for the free server (512MB RAM)
model = tf.keras.applications.MobileNetV2(weights='imagenet')

def prepare_image(image, target_size=(224, 224)):
    """
    Preprocesses the image to fit the model's input requirements.
    """
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    image = image.resize(target_size)
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    # MobileNetV2 uses a different preprocessing function
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image

def predict_insect(image_bytes):
    """
    Takes image bytes, processes it, and returns the top 3 predictions.
    """
    image = Image.open(io.BytesIO(image_bytes))
    processed_image = prepare_image(image)
    
    preds = model.predict(processed_image)
    decoded_preds = tf.keras.applications.mobilenet_v2.decode_predictions(preds, top=3)[0]
    
    results = []
    for i, (imagenet_id, label, score) in enumerate(decoded_preds):
        results.append({
            "label": label,
            "confidence": float(score) * 100,
            "description": f"Identified as {label} with {score:.2%} confidence."
        })
        
    return results
