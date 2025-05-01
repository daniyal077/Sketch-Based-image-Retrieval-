import io
from PIL import Image
from flask import request
from models.image_model import extract_features_from_image, find_similar_images
from views.responses import success_response, error_response
from utils.logger import logger

def find_similar():
    try:
        if 'image' not in request.files:
            return error_response("No image provided", 400)

        file = request.files['image']
        THRESHOLD = request.form.get('threshold', 0.4, type=float)

        logger.info(f"Finding similar images with threshold: {THRESHOLD}")

        image = Image.open(io.BytesIO(file.read()))
        input_features = extract_features_from_image(image)
        result = find_similar_images(input_features,THRESHOLD)
        return success_response(result)
    except Exception as e:
        logger.error(f"Error in find_similar controller: {e}", exc_info=True)
        return error_response(str(e), 500)
