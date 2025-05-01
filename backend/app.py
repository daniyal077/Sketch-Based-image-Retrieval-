from flask import Flask, request
from flask_cors import CORS
from controllers.find_similar_controller import find_similar
from controllers.sketch_controller import sketch
from controllers.text_generation_controller import generate_text_controller
from PIL import Image, ImageEnhance, ImageFilter
import io
import base64
from utils.logger import logger
from views.responses import success_response, error_response

app = Flask(__name__)
CORS(app)

logger.info("Starting Sketch-Based Image Retrieval API")

@app.route('/', methods=['GET'])
def home():
    return {"message": "Welcome to the Sketch-Based Image Retrieval API"}, 200

@app.route('/find_similar', methods=['POST'])
def find_similar_endpoint():
    return find_similar()

@app.route('/sketch', methods=['POST'])
def sketch_endpoint():
    return sketch()

@app.route('/generate_text', methods=['POST'])
def generate_text_endpoint():
    return generate_text_controller()



if __name__ == '__main__':
    logger.info("Starting Flask server on port 5000")
    app.run(debug=True, port=5000, host='0.0.0.0')