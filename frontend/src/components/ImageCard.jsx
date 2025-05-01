import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ImageCard.css';

function ImageCard({ imageUrl, altText, similarity, showSimilarity = false }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle image loading errors
  const handleImageError = () => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageError(true);
    setIsLoading(false);
  };

  // Handle image load complete
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Format similarity for display
  const formatSimilarity = (value) => {
    // If similarity is already a percentage (e.g., 85 instead of 0.85)
    if (value > 1) {
      return Math.round(value);
    }
    // Otherwise, convert from decimal to percentage
    return Math.round(value * 100);
  };

  // Handle image download
  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent event bubbling

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `design-inspiration-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Animation variants
  const animations = {
    hover: { y: -5, transition: { duration: 0.2 } },
    buttonHover: { scale: 1.2, transition: { duration: 0.2 } },
    buttonTap: { scale: 0.9 }
  };

  return (
    <motion.div
      className="image-box"
      whileHover={animations.hover}
    >
      <div className={`image-container ${isLoading ? 'loading' : ''}`}>
        {imageError ? (
          <div className="image-error">
            <span className="error-icon">⚠️</span>
            <span>Image unavailable</span>
          </div>
        ) : (
          <>
            <img
              src={imageUrl}
              alt={altText}
              className="retrieved-image"
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className="image-overlay">
              {showSimilarity && similarity !== undefined && (
                <motion.span
                  className="similarity-badge"
                  whileHover={{ scale: 1.1 }}
                >
                  {formatSimilarity(similarity)}% match
                </motion.span>
              )}
              <motion.button
                className="download-btn-small"
                onClick={handleDownload}
                title="Download image"
                aria-label="Download image"
                whileHover={animations.buttonHover}
                whileTap={animations.buttonTap}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 15V3M12 15L8 11M12 15L16 11M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ImageCard;
