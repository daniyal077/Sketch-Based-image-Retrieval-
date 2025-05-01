from flask import request
from models.text_generation import generate_text
from views.responses import success_response, error_response
from utils.logger import logger

def generate_text_controller():
    try:
        if 'image' not in request.files:
            return error_response("No image provided", 400)

        file = request.files['image']
        image_bytes = file.read()
        description = generate_text(image_bytes)
        return success_response({"message": "Text generated successfully.", "description": description})
    except Exception as e:
        logger.error(f"Error in text generation controller: {e}", exc_info=True)
        return error_response(str(e), 500)
