import os

# Model and data paths
MODEL_PATH = 'static/model.keras'
FEATURES_PATH = 'static/features_list.pkl'
IMAGE_PATHS_PATH = 'static/image_paths.pkl'
DATASET_PATH = 'static/Dataset/'

# Threshold and limits
THRESHOLD = 0.45
DEFAULT_TOP_N = 10

# Allowed image types and max image size
# ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp'}
MAX_IMAGE_SIZE = (1024, 1024)

# Check necessary files exist
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
if not os.path.exists(FEATURES_PATH) or not os.path.exists(IMAGE_PATHS_PATH):
    raise FileNotFoundError("Features or image paths file not found.")
