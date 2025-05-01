# feature_extraction.py
import os
import pickle
import time
import numpy as np
from tqdm import tqdm
from utils import load_model, extract_features
from logger_config import get_logger

# Initialize logger
logger = get_logger('feature_extraction')

# Configuration
dataset_path = os.path.join('.', 'Dataset')
image_extensions = ('.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif')
output_dir = '.'

def extract_and_save_features():
    """Extract features from all images in the dataset and save them to disk"""
    try:
        # Check if dataset directory exists
        if not os.path.exists(dataset_path):
            logger.error(f"Dataset directory not found: {dataset_path}")
            return False

        logger.info(f"Starting feature extraction from dataset: {dataset_path}")
        start_time = time.time()

        # Load model
        try:
            model = load_model()
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            return False

        feature_list = []
        relative_image_paths = []
        processed_count = 0
        error_count = 0

        # Walk through dataset
        for root, dirs, files in os.walk(dataset_path):
            image_files = [f for f in files if f.lower().endswith(image_extensions)]
            logger.info(f"Found {len(image_files)} images in {root}")

            for file in tqdm(image_files, desc=f"Extracting features from {os.path.basename(root)}"):
                rel_path = os.path.relpath(os.path.join(root, file), dataset_path)
                abs_path = os.path.join(root, file)

                features = extract_features(abs_path, model)
                if features is not None:
                    feature_list.append(features)
                    relative_image_paths.append(rel_path)
                    processed_count += 1
                else:
                    error_count += 1

        # Save extracted features
        if feature_list:
            features_path = os.path.join(output_dir, 'features_list.pkl')
            paths_path = os.path.join(output_dir, 'image_paths.pkl')

            try:
                with open(features_path, 'wb') as f:
                    pickle.dump(feature_list, f)
                logger.info(f"Saved features to {features_path}")

                with open(paths_path, 'wb') as f:
                    pickle.dump(relative_image_paths, f)
                logger.info(f"Saved image paths to {paths_path}")

                elapsed_time = time.time() - start_time
                logger.info(f"Feature extraction complete. Processed {processed_count} images with {error_count} errors in {elapsed_time:.2f} seconds")
                return True
            except Exception as e:
                logger.error(f"Error saving features: {str(e)}", exc_info=True)
                return False
        else:
            logger.error("No features extracted. Please check dataset and image files.")
            return False
    except Exception as e:
        logger.error(f"Unexpected error during feature extraction: {str(e)}", exc_info=True)
        return False

if __name__ == "__main__":
    logger.info("Starting feature extraction process")
    success = extract_and_save_features()
    if success:
        logger.info("Feature extraction completed successfully")
    else:
        logger.error("Feature extraction failed")
        exit(1)
