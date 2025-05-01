import logging
import os
import sys
from logging.handlers import RotatingFileHandler

# Create logs directory if it doesn't exist
os.makedirs('logs', exist_ok=True)

# Configure logger
logger = logging.getLogger('API')
logger.setLevel(logging.INFO)

# Create formatters
console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s')

# Create console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(console_formatter)

# Create file handler for rotating log files (max 5MB, keep 5 backup files)
file_handler = RotatingFileHandler('logs/sbir_api.log', maxBytes=5*1024*1024, backupCount=5)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(file_formatter)

# Add handlers to logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# Prevent propagation to root logger
logger.propagate = False
