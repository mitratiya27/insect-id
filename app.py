from flask import Flask, render_template, request, jsonify
from model_utils import predict_insect
import os
import gc

app = Flask(__name__)

# Ensure upload folder exists if we were to save files, 
# but we will process in memory for this example.

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        try:
            image_bytes = file.read()
            predictions = predict_insect(image_bytes)
            
            # Force garbage collection to free up memory immediately
            gc.collect()
            
            # Mocking additional info since we don't have a real database
            # In a real app, you'd look up the label in a DB to get this info.
            top_result = predictions[0]
            response_data = {
                'predictions': predictions,
                'top_match': top_result['label'],
                'info': {
                    'characteristics': f"Characteristics for {top_result['label']}...",
                    'risks': "Potential risks to crops...",
                    'prevention': "Recommended prevention methods...",
                    'impact': "Environmental impact details..."
                }
            }
            return jsonify(response_data)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # host='0.0.0.0' makes the server accessible from other devices on the same network
    app.run(debug=True, host='0.0.0.0')
