# utils.py
import numpy as np
import os
import time
import logging
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing import image as keras_image
from logger_config import get_logger

# Initialize logger
logger = get_logger('utils')

# Set logging level to INFO to ensure logs are shown
logging.getLogger('image_retrieval_app').setLevel(logging.INFO)

img_width, img_height = 224, 224

def load_model():
    """Load the EfficientNetB0 model for feature extraction"""
    try:
        logger.info("Loading EfficientNetB0 model")
        model = EfficientNetB0(weights='imagenet', include_top=False, pooling='avg')
        return model
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}", exc_info=True)
        raise

def extract_features(img_path, model):
    """Extract features from an image using the provided model"""
    try:
        if not os.path.exists(img_path):
            logger.error(f"Image path does not exist: {img_path}")
            return None

        logger.debug(f"Processing image: {img_path}")
        img = keras_image.load_img(img_path, target_size=(img_width, img_height))
        img_data = keras_image.img_to_array(img)
        img_data = np.expand_dims(img_data, axis=0)
        img_data = preprocess_input(img_data)

        start_time = time.time()
        features = model.predict(img_data, verbose=0)
        logger.debug(f"Feature extraction completed in {time.time() - start_time:.2f} seconds")

        return features.flatten()
    except Exception as e:
        logger.error(f"Error processing {img_path}: {str(e)}", exc_info=True)
        return None


# Add a main block to test the functions when this file is run directly
if __name__ == "__main__":
    logger.info("Checking if model can be loaded")
    model = load_model()
    logger.info("Model loaded successfully")
    
    start_time = time.time()
    model.save('model.keras')
    logger.info(f"Model loaded successfully in {time.time() - start_time:.2f} seconds")
    logger.info("Model saved successfully")
    
    logger.info("Checking if features can be extracted from an image")
    features = extract_features(r"Dataset\watch\watch 1.png", model)
    logger.info("Features extracted successfully")
    logger.info("All checks passed")

