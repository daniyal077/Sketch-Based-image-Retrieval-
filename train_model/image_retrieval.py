# image_retrieval.py
import os
import pickle
import time
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import normalize
from utils import load_model, extract_features
from logger_config import get_logger

# Initialize logger
logger = get_logger('image_retrieval')

# Configuration
dataset_path = os.path.join('.', 'Dataset')
features_path = 'features_list.pkl'
image_paths_file = 'image_paths.pkl'
default_threshold = 0.7
default_neighbors = 10

def load_features():
    """Load pre-extracted features and image paths from disk"""
    try:
        if not os.path.exists(features_path):
            logger.error(f"Features file not found: {features_path}")
            return None, None

        if not os.path.exists(image_paths_file):
            logger.error(f"Image paths file not found: {image_paths_file}")
            return None, None

        logger.info("Loading pre-extracted features and image paths")
        start_time = time.time()

        with open(features_path, 'rb') as f:
            feature_list = pickle.load(f)

        with open(image_paths_file, 'rb') as f:
            relative_image_paths = pickle.load(f)

        logger.info(f"Loaded {len(feature_list)} features in {time.time() - start_time:.2f} seconds")
        return feature_list, relative_image_paths
    except Exception as e:
        logger.error(f"Error loading features: {str(e)}", exc_info=True)
        return None, None

def find_similar_images(query_image_path, threshold=default_threshold, n_neighbors=default_neighbors):
    """Find images similar to the query image"""
    try:
        start_time = time.time()
        logger.info(f"Processing query image: {query_image_path}")

        # Check if query image exists
        if not os.path.exists(query_image_path):
            logger.error(f"Query image not found: {query_image_path}")
            return None

        # Load features and model
        feature_list, relative_image_paths = load_features()
        if feature_list is None or relative_image_paths is None:
            return None

        try:
            model = load_model()
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            return None

        # Extract features from query image
        query_features = extract_features(query_image_path, model)
        if query_features is None:
            logger.error("Could not extract features from the query image")
            return None

        # Normalize features
        logger.debug("Normalizing features")
        features_array = normalize(np.array(feature_list))
        query_features = normalize([query_features])

        # Find nearest neighbors
        logger.debug(f"Finding {n_neighbors} nearest neighbors with threshold {threshold}")
        knn = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine')
        knn.fit(features_array)

        distances, indices = knn.kneighbors(query_features)
        logger.debug(f"Distances: {distances[0]}")

        # Filter images based on threshold
        similar_images = []
        for idx, i in enumerate(indices[0]):
            if distances[0][idx] <= threshold:
                similar_images.append((relative_image_paths[i], distances[0][idx]))

        logger.info(f"Found {len(similar_images)} similar images in {time.time() - start_time:.2f} seconds")
        return similar_images
    except Exception as e:
        logger.error(f"Error finding similar images: {str(e)}", exc_info=True)
        return None

def show_similar_images(similar_images, dataset_path):
    """Display similar images using matplotlib"""
    try:
        if not similar_images:
            logger.warning("No similar images found to display")
            print("No similar image found.")
            return

        logger.info(f"Displaying {len(similar_images)} similar images")
        rows = (len(similar_images) + 4) // 5
        plt.figure(figsize=(20, 5 * rows))

        for i, (rel_path, distance) in enumerate(similar_images):
            img_path = os.path.join(dataset_path, rel_path)
            try:
                if not os.path.exists(img_path):
                    logger.warning(f"Image not found: {img_path}")
                    continue

                img = Image.open(img_path)
                plt.subplot(rows, 5, i + 1)
                plt.imshow(img)
                plt.title(f"Distance: {distance:.4f}")
                plt.axis('off')
            except Exception as e:
                logger.error(f"Error showing image {img_path}: {str(e)}")

        plt.tight_layout()
        plt.show()
    except Exception as e:
        logger.error(f"Error displaying images: {str(e)}", exc_info=True)

def main(query_image_path=None):
    """Main function to run the image retrieval process"""
    try:
        if query_image_path is None:
            logger.error("No sample images found. Please provide an image path.")
            print("No sample images found. Please provide an image path.")
            return

        # Find similar images
        similar_images = find_similar_images(query_image_path)

        # Display results
        if similar_images is not None:
            show_similar_images(similar_images, dataset_path)
        else:
            logger.error("Failed to find similar images")
            print("Could not find similar images. Check logs for details.")
    except Exception as e:
        logger.error(f"Unexpected error in main function: {str(e)}", exc_info=True)


if __name__ == "__main__":
    logger.info("Starting image retrieval application")
    query_image_path = r"F:\3rd milestone\train_model\mobile pic\WhatsApp Image 2025-04-10 at 13.00.21_88058c6c.jpg"
    main(query_image_path)
    logger.info("Image retrieval process completed")
