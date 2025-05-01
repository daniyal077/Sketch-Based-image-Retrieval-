import os
import pickle
import base64
import numpy as np
import cv2
import requests
from PIL import Image
import tensorflow as tf
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import normalize
from tensorflow.keras.applications.efficientnet import preprocess_input
from config import MODEL_PATH, FEATURES_PATH, IMAGE_PATHS_PATH, DATASET_PATH, DEFAULT_TOP_N
from utils.logger import logger
from io import BytesIO

# Load model and precomputed data
logger.info(f"Loading model from {MODEL_PATH}")
model = tf.keras.models.load_model(MODEL_PATH)

logger.info(f"Loading features from {FEATURES_PATH}")
with open(FEATURES_PATH, 'rb') as f:
    features_list = pickle.load(f)
    features_array = normalize(np.array(features_list))
    logger.info(f"Loaded {len(features_list)} feature vectors")

logger.info(f"Loading image paths from {IMAGE_PATHS_PATH}")
with open(IMAGE_PATHS_PATH, 'rb') as f:
    image_paths = pickle.load(f)
    logger.info(f"Loaded {len(image_paths)} image paths")

def extract_features_from_image(image: Image.Image):
    """Extract features from the input image using a pre-trained EfficientNetB0 model."""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    img = image.resize((224, 224))
    img_data = tf.keras.preprocessing.image.img_to_array(img)
    img_data = np.expand_dims(img_data, axis=0)
    img_data = preprocess_input(img_data)
    features = model.predict(img_data, verbose=0)
    return features.flatten()

def find_similar_images(input_features, THRESHOLD):
    """Return similar images based on nearest neighbors with cosine distance."""
    # Normalize input features
    query_features = normalize([input_features])

    # Find nearest neighbors
    knn = NearestNeighbors(n_neighbors=DEFAULT_TOP_N, metric='cosine')
    knn.fit(features_array)

    distances, indices = knn.kneighbors(query_features)
    print(indices)

    # Convert distances to similarities (cosine distance = 1 - cosine similarity)
    similarities = 1 - distances[0]

    # Filter by threshold
    valid_indices = np.where(similarities > THRESHOLD)[0]
    if len(valid_indices) == 0:
        return {"message": "No similar image found."}

    # Get the corresponding indices from knn results
    valid_knn_indices = indices[0][valid_indices]
    valid_similarities = similarities[valid_indices]

    # Sort by similarity (highest first)
    sorted_idx = np.argsort(valid_similarities)[::-1]
    valid_knn_indices = valid_knn_indices[sorted_idx]
    valid_similarities = valid_similarities[sorted_idx]

    # Limit to DEFAULT_TOP_N
    valid_knn_indices = valid_knn_indices[:DEFAULT_TOP_N]
    valid_similarities = valid_similarities[:DEFAULT_TOP_N]
    logger.debug(f"Similarity scores: {valid_similarities}")

    similar_images = []
    for i, idx in enumerate(valid_knn_indices):
        # Get the image path from the list
        image_path = image_paths[idx]
        logger.info(f"Processing image path: {image_path}")

        try:
            # Check if the path is a URL or contains a URL
            if 'http' in image_path:
                # Extract the URL part if it's mixed with a local path
                url_start = image_path.find('http')
                url = image_path[url_start:]

                # Fetch the image from the URL
                # logger.info(f"Fetching image from URL: {url}")
                response = requests.get(url, timeout=10)
                response.raise_for_status()  # Raise an exception for HTTP errors
                image_data = response.content
                encoded_image = base64.b64encode(image_data).decode('utf-8')
            else:
                # It's a local path, handle Windows-style paths
                local_path = image_path.replace('\\', '/')
                image_file_path = os.path.join(DATASET_PATH, local_path)
                logger.info(f"Loading image from local path: {image_file_path}")
                with open(image_file_path, 'rb') as f:
                    encoded_image = base64.b64encode(f.read()).decode('utf-8')

            similar_images.append({
                "image": encoded_image,
                "similarity": float(valid_similarities[i])
            })
        except Exception as e:
            logger.error(f"Error loading image {image_path}: {str(e)}")
            # Continue with other images
    # print([img['similarity'] for img in similar_images])

    return {"similar_images": similar_images}

def convert_to_sketch(image: Image.Image):
    """Convert the input image into a sketch using OpenCV."""
    gray_image = cv2.cvtColor(np.array(image.convert("RGB")), cv2.COLOR_BGR2GRAY)
    inverted = cv2.bitwise_not(gray_image)
    blurred = cv2.GaussianBlur(inverted, (21, 21), 0)
    sketch = cv2.divide(gray_image, cv2.bitwise_not(blurred), scale=256.0)
    return sketch
