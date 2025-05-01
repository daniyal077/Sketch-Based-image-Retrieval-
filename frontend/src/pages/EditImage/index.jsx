import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, fadeInVariants } from '../../utils/animationUtils';
import './index.css';

// SVG icons as constants
const uploadIcon = (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const downloadIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function EditImage() {
  // State variables
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [edits, setEdits] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hue: 0
  });

  // Refs
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setEditedImage(e.target.result);
        // Reset edits
        setEdits({
          brightness: 100,
          contrast: 100,
          grayscale: 0,
          sepia: 0,
          blur: 0,
          hue: 0
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit parameter changes
  const handleEditChange = (type, value) => {
    setEdits(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Download the edited image
  const handleDownload = () => {
    if (!editedImage) return;

    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = editedImage;
    link.click();
  };

  // Render edit control
  const renderEditControl = (label, property, min, max, unit = '%') => (
    <div className="edit-control">
      <label>{label} <span>{edits[property]}{unit}</span></label>
      <input
        type="range"
        min={min}
        max={max}
        value={edits[property]}
        onChange={(e) => handleEditChange(property, e.target.value)}
      />
    </div>
  );

  // Apply edits whenever edits state changes
  useEffect(() => {
    if (!image) return;

    const applyEdits = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply filters
        ctx.filter = `
          brightness(${edits.brightness}%)
          contrast(${edits.contrast}%)
          grayscale(${edits.grayscale}%)
          sepia(${edits.sepia}%)
          blur(${edits.blur}px)
          hue-rotate(${edits.hue}deg)
        `;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Reset filter
        ctx.filter = 'none';

        // Set the edited image
        setEditedImage(canvas.toDataURL());
      };

      img.src = image;
    };

    applyEdits();
  }, [edits, image]);

  return (
    <motion.div
      className="edit-image-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.div className="edit-container" variants={fadeInVariants}>
        {/* Upload Section */}
        <motion.div
          className="upload-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="upload-card card">
            <h2 className="card-title">Upload Product Visual</h2>
            {/* <p className="card-description">Upload your product design image to enhance and refine it for presentations or documentation.</p> */}
            <div
              className="upload-area"
              onClick={() => fileInputRef.current.click()}
            >
              {image ? (
                <img src={image} alt="Original" className="upload-preview" />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">{uploadIcon}</div>
                  <p className="upload-instruction">Click to select an image</p>
                  <p className="upload-subtext">or drag and drop</p>
                  <p className="upload-formats">Supported formats: JPEG, PNG, GIF, WebP</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Edit Section - Parallel Layout */}
        {image && (
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Edit Controls */}
            <div className="edit-card card">
              <h2 className="card-title">Product Visual Refinement</h2>
              <p className="card-description">Adjust these parameters to enhance your product design image.</p>
              <div className="edit-controls">
                {renderEditControl('Brightness', 'brightness', 0, 200)}
                {renderEditControl('Contrast', 'contrast', 0, 200)}
                {renderEditControl('Grayscale', 'grayscale', 0, 100)}
                {renderEditControl('Sepia', 'sepia', 0, 100)}
                {renderEditControl('Blur', 'blur', 0, 10, 'px')}
                {renderEditControl('Hue Rotate', 'hue', 0, 360, '°')}
              </div>
            </div>

            {/* Preview Section */}
            <div className="preview-card card">
              <h2 className="card-title">Preview</h2>
              <p className="card-description">See the results of your adjustments in real-time.</p>
              <div className="preview-container">
                {editedImage ? (
                  <img src={editedImage} alt="Edited" className="edited-preview" />
                ) : (
                  <div className="preview-placeholder">Adjust settings to see preview</div>
                )}
              </div>
              <div className="preview-actions">
                <button className="action-button animate-button" onClick={handleDownload} disabled={!editedImage}>
                  {downloadIcon}
                  Export Product Visual
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </motion.div>
  );
}

export default EditImage;
