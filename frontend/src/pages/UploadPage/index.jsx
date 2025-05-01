import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { imageService } from "../../services/api";
import { motion } from "framer-motion";
import "./index.css";

// SVG icons as constants
const addIcon = (
  <svg viewBox="0 0 24 24" width="48" height="48">
    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
  </svg>
);

const imageIcon = (
  <svg viewBox="0 0 24 24" width="64" height="64">
    <path fill="currentColor" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
  </svg>
);

const downloadIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2">
    <path d="M12 15V3M12 15L8 11M12 15L16 11M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"/>
  </svg>
);

function UploadPage() {
  // State variables
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const [sketchImage, setSketchImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  // Animation variants
  const animations = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.8, staggerChildren: 0.2, delayChildren: 0.1 }
      }
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: (i) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, delay: i * 0.05 || 0 }
      })
    },
    button: {
      hover: {
        scale: 1.05,
        transition: { duration: 0.3, ease: "easeOut" }
      },
      tap: { scale: 0.95 }
    },
    image: {
      animate: {
        scale: [1, 1.03, 1],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
    }
  };

  // Download image function
  const downloadImage = (imageUrl, filename = 'retrieved-image') => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${filename}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
      setRetrievedImages([]);
      setSketchImage(null);
      setErrorMessage("");
      setUploadedImageURL(URL.createObjectURL(file));
    } else {
      setErrorMessage("Please upload a valid image file.");
    }
  };

  // Find similar images
  const handleAnalyze = async () => {
    if (!uploadedImage) {
      setErrorMessage("No image uploaded for analysis.");
      return;
    }

    setSketchImage(null);
    setLoadingAction("analyze");
    setErrorMessage("");

    try {
      const response = await imageService.findSimilar(uploadedImage);
      const data = response.data;

      if (data.message === "No similar image found.") {
        setErrorMessage(data.message);
      } else {
        const decodedImages = data.similar_images.map((image) => ({
          url: "data:image/png;base64," + image.image,
          similarity: image.similarity
        }));
        setRetrievedImages(decodedImages);
      }
    } catch (error) {
      setErrorMessage("Error during analysis: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingAction("");
    }
  };

  // Convert image to sketch
  const handleImageToSketch = async () => {
    if (!uploadedImage) {
      setErrorMessage("No image uploaded for conversion.");
      return;
    }

    setRetrievedImages([]);
    setLoadingAction("sketch");
    setErrorMessage("");

    try {
      const response = await imageService.generateSketch(uploadedImage);
      setSketchImage("data:image/png;base64," + response.data.sketch);
    } catch (error) {
      setErrorMessage("Error during sketch conversion: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingAction("");
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (uploadedImageURL) {
        URL.revokeObjectURL(uploadedImageURL);
      }
    };
  }, [uploadedImageURL]);

  // Render loading button based on action type
  const renderActionButton = (action, label, onClick) => (
    <motion.button
      className={`btn ${action === 'analyze' ? 'btn-primary' : 'btn-secondary'}`}
      onClick={onClick}
      disabled={loadingAction === action}
      variants={animations.item}
      whileHover={!loadingAction ? animations.button.hover : {}}
      whileTap={!loadingAction ? animations.button.tap : {}}
    >
      {loadingAction === action ? (
        <>
          <span className="spinner spinner-small"></span>
          <span>{action === 'analyze' ? 'Analyzing...' : 'Converting...'}</span>
        </>
      ) : (
        label
      )}
    </motion.button>
  );

  return (
    <motion.div
      className="upload-page"
      initial="hidden"
      animate="visible"
      variants={animations.container}
    >
      {/* Upload Section */}
      <motion.div className="upload-container" variants={animations.item}>
        <motion.div className="upload-card card" variants={animations.item}>
          <motion.h2 className="card-title" variants={animations.item}>Upload Reference Product</motion.h2>

          <motion.div
            className="upload-area"
            onClick={() => document.getElementById("file-input").click()}
            variants={animations.item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {uploadedImageURL ? (
              <motion.img
                src={uploadedImageURL}
                alt="Uploaded preview"
                className="upload-preview"
                variants={animations.item}
              />
            ) : (
              <motion.div className="upload-placeholder" variants={animations.item}>
                <motion.div
                  className="upload-icon"
                  variants={animations.item}
                  animate={animations.image.animate}
                >
                  {addIcon}
                </motion.div>
                <motion.p className="upload-instruction" variants={animations.item}>Click to select an image</motion.p>
                <motion.p className="upload-subtext" variants={animations.item}>or drag and drop</motion.p>
                <motion.p className="upload-formats" variants={animations.item}>Supported formats: JPEG, PNG, GIF, WebP</motion.p>
                <motion.p className="upload-note" variants={animations.item}>Note: Currently only works with umbrella and watch products</motion.p>
              </motion.div>
            )}
          </motion.div>

          <motion.input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
            variants={animations.item}
          />

          {errorMessage && (
            <motion.div
              variants={animations.item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />
            </motion.div>
          )}

          {uploadedImageURL && (
            <motion.div
              className="action-buttons"
              variants={animations.item}
            >
              {renderActionButton('analyze', 'Find Similar Products', handleAnalyze)}
              {renderActionButton('sketch', 'Create Design Outline', handleImageToSketch)}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        className="results-container"
        variants={animations.item}
        initial="hidden"
        animate="visible"
      >
        {/* Loading State */}
        {loadingAction && !sketchImage && !(retrievedImages && retrievedImages.length > 0) && (
          <motion.div
            className="loading-wrapper card"
            variants={animations.item}
          >
            <Loading
              size="large"
              text={loadingAction === "analyze" ? "Analyzing product reference..." : "Creating design outline..."}
            />
          </motion.div>
        )}

        {/* Sketch Result */}
        {sketchImage && (
          <motion.div
            className="result-card card"
            variants={animations.item}
          >
            <motion.h2 className="card-title" variants={animations.item}>Design Outline</motion.h2>
            <motion.div className="result-content" variants={animations.item}>
              <motion.div className="result-image-container" variants={animations.item}>
                <motion.img
                  src={sketchImage}
                  alt="Sketch result"
                  className="result-image"
                  variants={animations.item}
                />
              </motion.div>
              <motion.button
                className="btn btn-primary download-btn"
                onClick={() => downloadImage(sketchImage, 'sketch-result')}
                variants={animations.item}
                whileHover={animations.button.hover}
                whileTap={animations.button.tap}
              >
                {downloadIcon}
                {/* Download Outline */}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Similar Images Results */}
        {retrievedImages && retrievedImages.length > 0 && (
          <motion.div
            className="result-card card"
            variants={animations.item}
          >
            <motion.h2 className="card-title" variants={animations.item}>Similar Products ({retrievedImages.length})</motion.h2>
            <motion.div className="image-grid" variants={animations.item}>
              {retrievedImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="image-box"
                  variants={animations.item}
                  custom={index}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.div className="image-container" variants={animations.item}>
                    <motion.img
                      src={image.url}
                      alt={`Retrieved ${index + 1}`}
                      className="retrieved-image"
                      loading="lazy"
                      variants={animations.item}
                    />
                    <motion.div className="image-overlay" variants={animations.item}>
                      <motion.span
                        className="similarity-badge"
                        variants={animations.item}
                        whileHover={{ scale: 1.1 }}
                      >
                        {Math.round(image.similarity * 100)}% match
                      </motion.span>
                      <motion.button
                        className="download-btn-small"
                        onClick={() => downloadImage(image.url, `similar-image-${index+1}`)}
                        title="Download image"
                        aria-label="Download image"
                        variants={animations.item}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 15V3M12 15L8 11M12 15L16 11M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loadingAction && !sketchImage && !(retrievedImages && retrievedImages.length > 0) && (
          <motion.div
            className="empty-state card"
            variants={animations.item}
          >
            <motion.div
              className="empty-icon"
              variants={animations.item}
              animate={animations.image.animate}
            >
              {imageIcon}
            </motion.div>
            <motion.h3 variants={animations.item}>Product Research Ready</motion.h3>
            <motion.p variants={animations.item}>Upload a reference product image to find similar designs or create a design outline</motion.p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default UploadPage;