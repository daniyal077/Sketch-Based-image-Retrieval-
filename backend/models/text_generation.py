import os
import base64
from groq import Groq
from dotenv import load_dotenv, find_dotenv
from utils.logger import logger

load_dotenv(find_dotenv())
logger.info("Loaded environment variables for text generation")

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def generate_text(image_bytes):
    """
    Generate a text description of an image focusing on a watch.
    Adjusts the response if no watch is found or if multiple objects exist.
    """
    try:
        logger.info("Starting text generation for image")
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        client = Groq()
        model_name = os.getenv("MODEL")

        if not model_name:
            logger.error("MODEL environment variable not set")
            raise ValueError("MODEL environment variable not set")

        logger.info(f"Using model: {model_name}")

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Please analyze the uploaded image and provide a detailed description of the product’s features."
                                "Focus on the following aspects: color, shape, style, materials, design elements, and overall aesthetics."
                                "Based on your observations, offer innovative design suggestions that focus on design improvement rather than functionality."
                                "Describe how the product designer could enhance the design or create new design concepts."
                                "If the image does not clearly show a watch product or contains multiple unrelated objects, respond with:"
                                "'Unfortunately, I am not able to generate a description for this object. I can only generate descriptions for watches."
                                "Use simple, clear language with common vocabulary."
                                "Format your response as a concise paragraph or with bullet points. Do not use formatting markers such as '**'."
                                "Do not begin with generic phrases like 'Here is a detailed description of a product.'"
                                "When giving a suggestion, start on a new line with the heading 'Suggestion heading.'"
                                "If there is more than one suggestion, use bullet points or numbers as appropriate."
                            ),
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            model=model_name,
        )

        content = response.choices[0].message.content
        logger.info("Text generation completed successfully")
        return content
    except Exception as e:
        logger.error(f"Error in text generation: {e}", exc_info=True)
        raise
