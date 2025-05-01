import logging
import sys

# Configure logger
def setup_logger(name, level=logging.INFO):
    """Function to set up a logger with console handler only"""
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.propagate = False  # Prevent propagation to avoid duplicate logs

    # Remove existing handlers if any to avoid duplicate logs
    if logger.hasHandlers():
        logger.handlers.clear()

    # Create formatter with detailed information for better debugging
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
    )

    # Create console handler that writes to stdout
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger

# Create main application logger
app_logger = setup_logger('image_retrieval_app', level=logging.INFO)

# Function to get module-specific loggers
def get_logger(module_name):
    """Get a logger for a specific module"""
    return setup_logger(f'image_retrieval_app.{module_name}', level=logging.INFO)

# Test the logger when this file is run directly
if __name__ == "__main__":
    logger = get_logger('logger_test')
    logger.debug("This is a DEBUG message")
    logger.info("This is an INFO message")
    logger.warning("This is a WARNING message")
    logger.error("This is an ERROR message")
    logger.critical("This is a CRITICAL message")
