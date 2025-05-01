# DesignFlow - AI-Powered Design Tool

DesignFlow is an advanced web application that combines image retrieval, sketch generation, and text description capabilities using machine learning. It helps designers find inspiration, validate concepts, and accelerate their workflow.

## Features

- **Image Similarity Search**: Find visually similar product designs from a database
- **Sketch-Based Image Retrieval**: Convert rough sketches into professional product images
- **Text Description Generation**: Generate detailed descriptions of product designs
- **Image Editing Tools**: Basic editing capabilities for design refinement

## Project Structure

The project consists of three main components:

### Backend

The backend is built with Flask and provides the following API endpoints:

- `/find_similar`: Finds visually similar images based on an uploaded image
- `/sketch`: Converts an image to a sketch
- `/generate_text`: Generates a text description for an uploaded image

Key technologies:
- Flask for the web server
- TensorFlow for the machine learning models
- OpenCV for image processing
- Groq API for text generation

### Frontend

The frontend is built with React and Vite, providing a modern and responsive user interface with the following pages:

- Home: Landing page with feature overview
- Design Sketch: Create and convert sketches
- Image Search: Upload images to find similar designs
- Generate Description: Get AI-generated descriptions of designs
- Design Editor: Basic image editing tools

Key technologies:
- React for the UI framework
- Framer Motion for animations
- React Router for navigation
- Custom UI components

### Train Model

The train_model component contains the code used to train the machine learning models that power the application:

- Image feature extraction using EfficientNet
- Similarity search using nearest neighbors
- Sketch generation algorithms
- Dataset preprocessing and management

## Setup and Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker and Docker Compose (for deployment)

### Development Setup

1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Required Model Files**:
   The following files need to be placed in the `backend/static` directory:
   - `model.keras`: The trained machine learning model
   - `features_list.pkl`: Pre-computed features for the dataset
   - `image_paths.pkl`: Paths to the images in the dataset
   - `Dataset/`: Directory containing the reference images

### Docker Deployment

#### Prerequisites

- Docker and Docker Compose installed
- At least 4GB of RAM available for Docker

#### Option 1: Quick Start with Local Files

1. Create a directory for the application:
   ```bash
   mkdir designflow && cd designflow
   ```

2. Download the docker-compose.yml file:
   ```bash
   curl -O https://raw.githubusercontent.com/yourusername/designflow/main/docker-compose.yml
   ```

3. Create a directory for the static files:
   ```bash
   mkdir -p backend/static
   ```

4. Download the required model and data files to the static directory (contact the repository owner for access)

5. Start the application:
   ```bash
   docker-compose up -d
   ```

6. Access the application at http://localhost

#### Option 2: Using Pre-built Docker Images

If you want to use pre-built Docker images without cloning the repository:

1. Create a docker-compose.yml file:
   ```yaml
   services:
     backend:
       image: yourusername/designflow-backend:v1.0.1
       container_name: designflow-backend
       restart: always
       environment:
         - FLASK_ENV=production
       ports:
         - "5000:5000"
       volumes:
         - ./backend/static:/app/static
       networks:
         - app-network

     frontend:
       image: yourusername/designflow-frontend:v1.0.1
       container_name: designflow-frontend
       restart: always
       ports:
         - "3000:80"
       depends_on:
         - backend
       networks:
         - app-network

   networks:
     app-network:
       driver: bridge
   ```

2. Pull and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Access the application at http://localhost:3000


## Configuration

The application can be configured through environment variables:

- `FLASK_ENV`: Set to 'production' for production deployment or 'development' for development
- Additional configuration options can be found in the backend/config.py file

## Troubleshooting

If you encounter issues:

1. Check the logs:
```bash
docker-compose logs
```

2. Ensure the static files are properly mounted:
```bash
docker-compose exec backend ls -la /app/static
```

3. Verify the backend is healthy:
```bash
docker ps
```

## API Documentation

### Find Similar Images
- **Endpoint**: `/find_similar`
- **Method**: POST
- **Parameters**:
  - `image`: The image file to find similar images for
  - `threshold`: Similarity threshold (0.0-1.0)
- **Response**: JSON with similar images and their similarity scores

### Generate Sketch
- **Endpoint**: `/sketch`
- **Method**: POST
- **Parameters**:
  - `image`: The image file to convert to a sketch
- **Response**: JSON with base64-encoded sketch image

### Generate Text Description
- **Endpoint**: `/generate_text`
- **Method**: POST
- **Parameters**:
  - `image`: The image file to generate a description for
- **Response**: JSON with generated text description


## Dataset Training

For training the model with your own dataset:

1. Create a dataset structure in the train_model directory:
   ```
   train_model/
   └── Dataset/
       ├── category1/
       │   ├── image1.jpg
       │   ├── image2.jpg
       │   └── ...
       ├── category2/
       │   ├── image1.jpg
       │   ├── image2.jpg
       │   └── ...
       └── ...
   ```

2. Each category folder should contain multiple images of that product category.

3. Adjust the threshold value in `backend/config.py` according to your model's performance:
   ```python
   # Increase for stricter matching, decrease for more results
   THRESHOLD = 0.45  # Default value
   ```

4. After training, the following files will be generated:
   - `model.keras`: The trained machine learning model
   - `features_list.pkl`: Pre-computed features for the dataset
   - `image_paths.pkl`: Paths to the images in the dataset

5. Copy these files to the `backend/static` directory for the application to use.

## Backend Setup

When running the backend, ensure you have the following structure:

```
backend/
└── static/
    ├── Dataset/
    │   ├── category1/
    │   │   ├── image1.jpg
    │   │   └── ...
    │   └── ...
    ├── model.keras
    ├── features_list.pkl
    └── image_paths.pkl
```

These files are essential for the application to function properly:
- `model.keras`: The trained neural network model
- `features_list.pkl`: Contains pre-computed feature vectors for all images
- `image_paths.pkl`: Contains paths to all images in the dataset
- `Dataset/`: Directory containing all reference images organized by category

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request


