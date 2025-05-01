import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { imageService } from "../../services/api";
import { motion } from "framer-motion";
import "./index.css";

function GenerateTextPage() {
  // State variables
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [generatedText, setGeneratedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
      setGeneratedText("");
      setErrorMessage("");
      setUploadedImageURL(URL.createObjectURL(file));
    } else {
      setErrorMessage("Please upload a valid image file.");
    }
  };

  // Generate text description from image
  const handleGenerateText = async () => {
    if (!uploadedImage) {
      setErrorMessage("No image uploaded for text generation.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await imageService.generateText(uploadedImage);
      setGeneratedText(response.data.description);
    } catch (error) {
      setErrorMessage("Error during text generation: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
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

  // Handle text download
  const handleDownloadText = () => {
    if (!generatedText) return;

    const element = document.createElement("a");
    const file = new Blob([generatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "generated-description.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Render action button
  const renderActionButton = () => (
    <motion.button
      className="btn btn-primary btn-lg"
      onClick={handleGenerateText}
      disabled={isLoading}
      variants={animations.item}
      whileHover={!isLoading ? animations.button.hover : {}}
      whileTap={!isLoading ? animations.button.tap : {}}
    >
      Generate Product Specification
    </motion.button>
  );

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
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
    </svg>
  );

  return (
    <motion.div
      className="generate-text-page"
      initial="hidden"
      animate="visible"
      variants={animations.container}
    >
      <motion.main className="main-content" variants={animations.item}>
        {/* Upload Section */}
        <motion.div className="upload-section" variants={animations.item}>
          <motion.div className="upload-card card" variants={animations.item}>
            <motion.h2 className="card-title" variants={animations.item}>Upload Product Design</motion.h2>

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
                  <motion.p className="upload-note" variants={animations.item}>Note: Currently only works with watch products</motion.p>
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
                className="button-container"
                variants={animations.item}
              >
                {renderActionButton()}
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
          {isLoading && !generatedText && (
            <motion.div
              className="loading-wrapper card"
              variants={animations.item}
            >
              <Loading size="large" text="Analyzing design and generating documentation..." />
            </motion.div>
          )}

          {/* Generated Text Result */}
          {generatedText && (
            <motion.div
              className="result-card card"
              variants={animations.item}
            >
              <motion.h2 className="card-title" variants={animations.item}>Design Documentation</motion.h2>
              <motion.p className="card-description" variants={animations.item}>
                Generated specifications and requirements based on your product design image.
              </motion.p>
              <motion.div className="text-content" variants={animations.item}>
                <motion.p className="generated-text" variants={animations.item}>{generatedText}</motion.p>
                <motion.button
                  className="download-btn"
                  onClick={handleDownloadText}
                  variants={animations.item}
                  whileHover={animations.button.hover}
                  whileTap={animations.button.tap}
                >
                  {downloadIcon}
                  {/* Download Documentation */}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !generatedText && (
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
              <motion.h3 variants={animations.item}>Product Documentation Assistant</motion.h3>
              <motion.p variants={animations.item}>Upload your product design mockup or sketch and generate comprehensive specifications, feature lists, and technical requirements for your design team.</motion.p>
            </motion.div>
          )}
        </motion.div>
      </motion.main>
    </motion.div>
  );
}

export default GenerateTextPage;