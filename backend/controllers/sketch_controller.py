import io
import cv2
import base64
from PIL import Image
from flask import request
from models.image_model import convert_to_sketch
from views.responses import success_response, error_response
from utils.logger import logger

def sketch():
    try:
        if 'image' not in request.files:
            return error_response("No image provided", 400)

        file = request.files['image']
        image = Image.open(io.BytesIO(file.read()))
        sketch_image = convert_to_sketch(image)

        # Encode sketch image as PNG and then to base64
        _, buffer = cv2.imencode('.png', sketch_image)
        encoded_sketch = base64.b64encode(buffer).decode('utf-8')
        return success_response({"message": "Sketch generated successfully.", "sketch": encoded_sketch})
    except Exception as e:
        logger.error(f"Error in sketch controller: {e}", exc_info=True)
        return error_response(str(e), 500)
