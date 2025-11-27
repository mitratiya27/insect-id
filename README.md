# Insect Identification System

A web-based application that uses Artificial Intelligence to identify insect species from images.

## Features
- **AI-Powered Identification**: Uses MobileNetV2 to classify insect images.
- **Responsive Design**: Works on mobile, tablet, and desktop.
- **Instant Analysis**: Provides identification results, confidence scores, and related information.

## Prerequisites
- Python 3.8+
- pip (Python package manager)

## Installation

1.  **Clone or Download** the project to your local machine.
2.  **Navigate** to the project directory:
    ```bash
    cd path/to/project
    ```
3.  **Create a Virtual Environment** (Recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```
4.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Application

1.  Start the Flask server:
    ```bash
    python app.py
    ```
2.  Open your web browser and go to:
    ```
    http://127.0.0.1:5000
    ```
3.  Upload an image of an insect to see the results!

## Project Structure
- `app.py`: Main Flask application server.
- `model_utils.py`: Handles image processing and AI model predictions.
- `templates/`: Contains HTML files.
- `static/`: Contains CSS and JavaScript files.
