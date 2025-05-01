import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApi } from '../../context/ApiContext';
import Button from '../../components/ui/Button';
import Slider from '../../components/ui/Slider';
import ToggleButton from '../../components/ui/ToggleButton';
import ButtonGroup from '../../components/ui/ButtonGroup';
import ImageCard from '../../components/ImageCard';
import Loading from '../../components/Loading';
import { motion } from 'framer-motion';
import './index.css';

/**
 * SketchPage component - allows product designers to create sketches and find design inspirations
 */
const SketchPage = () => {
  // Refs
  const canvasRef = useRef(null);
  const canvasStateRef = useRef(null);

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

  // Drawing state
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [shape, setShape] = useState('freehand');
  const [mode, setMode] = useState('draw'); // 'draw' or 'select'
  const [customColor, setCustomColor] = useState('');

  // Interaction state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const [colorHistory, setColorHistory] = useState(['#000000']);

  // History state
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // UI state
  const [retrievedImages, setRetrievedImages] = useState([]);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Hooks
  const { imageService } = useApi();

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Initialize history with the blank canvas
      const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, []);

  // Canvas drawing handlers
  const handleMouseDown = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the canvas bounding rectangle
    const rect = canvas.getBoundingClientRect();

    // Calculate the scale factors
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calculate the actual position on the canvas
    const x = (e.nativeEvent.offsetX) * scaleX;
    const y = (e.nativeEvent.offsetY) * scaleY;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (mode === 'draw') {
      // Save the current canvas state before starting to draw
      if (shape !== 'freehand') {
        canvasStateRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      // Update interaction state
      setIsDrawing(true);
      setStartPos({ x, y });
      setHasDrawn(true);

      // Set up drawing context
      ctx.strokeStyle = isErasing ? '#FFFFFF' : color;
      ctx.fillStyle = isErasing ? '#FFFFFF' : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (shape === 'freehand') {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    } else if (mode === 'select') {
      // In select mode, we're preparing to drag elements
      setIsDragging(true);
      setDragStartPos({ x, y });

      // Save the current canvas state for dragging
      canvasStateRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }, [color, brushSize, isErasing, shape, mode]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Get the canvas bounding rectangle
    const rect = canvas.getBoundingClientRect();

    // Calculate the scale factors
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calculate the actual position on the canvas
    const currentX = (e.nativeEvent.offsetX) * scaleX;
    const currentY = (e.nativeEvent.offsetY) * scaleY;

    if (isDrawing && mode === 'draw') {
      if (shape === 'freehand') {
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      } else {
        // For shapes, restore the original canvas state first
        if (canvasStateRef.current) {
          ctx.putImageData(canvasStateRef.current, 0, 0);
        }

        // Then draw the shape based on the current mouse position
        ctx.beginPath();

        if (shape === 'line') {
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        } else if (shape === 'rectangle') {
          const width = currentX - startPos.x;
          const height = currentY - startPos.y;
          ctx.strokeRect(startPos.x, startPos.y, width, height);
        } else if (shape === 'circle') {
          const radius = Math.sqrt(
            Math.pow(currentX - startPos.x, 2) + Math.pow(currentY - startPos.y, 2)
          );
          ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    } else if (isDragging && mode === 'select' && canvasStateRef.current) {
      // Calculate the drag distance
      const dx = currentX - dragStartPos.x;
      const dy = currentY - dragStartPos.y;

      // Clear the canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create a temporary canvas for dragging
      if (!window.tempCanvas) {
        window.tempCanvas = document.createElement('canvas');
        window.tempCanvas.width = canvas.width;
        window.tempCanvas.height = canvas.height;
      }

      const tempCanvas = window.tempCanvas;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

      // Clear the temp canvas
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original state to the temp canvas
      tempCtx.putImageData(canvasStateRef.current, 0, 0);

      // Draw the temp canvas onto the main canvas with the offset
      ctx.drawImage(tempCanvas, dx, dy);
    }
  }, [isDrawing, isDragging, shape, startPos, dragStartPos, mode]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing && !isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (shape === 'freehand') {
      ctx.closePath();
    }

    // Clear the saved canvas state
    canvasStateRef.current = null;

    // Update interaction state
    setIsDrawing(false);
    setIsDragging(false);

    // Save the current state to history for undo/redo
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = [...history.slice(0, historyIndex + 1), imageData];

    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
  }, [isDrawing, isDragging, shape, history, historyIndex]);

  // Undo the last action
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return; // Nothing to undo

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Go back one step in history
    const newIndex = historyIndex - 1;

    // Apply the previous state
    if (newIndex >= 0) {
      ctx.putImageData(history[newIndex], 0, 0);
    } else {
      // If we're at the beginning, clear the canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Update history state
    setHistoryIndex(newIndex);
  }, [history, historyIndex]);

  // Redo the last undone action
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return; // Nothing to redo

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Go forward one step in history
    const newIndex = historyIndex + 1;

    // Apply the next state
    ctx.putImageData(history[newIndex], 0, 0);

    // Update history state
    setHistoryIndex(newIndex);
  }, [history, historyIndex]);

  // Clear the canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update interaction and UI state
    setHasDrawn(false);
    setRetrievedImages([]);
    setError(null);

    // Add the cleared canvas to history
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = [...history.slice(0, historyIndex + 1), imageData];

    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
  }, [history, historyIndex]);

  // Create a white background image for analysis
  const createWhiteBackgroundImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Fill with white background
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the sketch on top
    tempCtx.drawImage(canvas, 0, 0);

    return tempCanvas;
  }, []);

  // Download the sketch
  const downloadSketch = useCallback(() => {
    if (!hasDrawn) {
      setError('Please draw something on the canvas before downloading');
      return;
    }

    const tempCanvas = createWhiteBackgroundImage();
    if (!tempCanvas) return;

    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'design-sketch.png';
    link.click();
  }, [hasDrawn, createWhiteBackgroundImage]);

  // Handle custom color input
  const handleCustomColorChange = useCallback((e) => {
    let value = e.target.value;
    // Add # if it's missing
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    setCustomColor(value);
  }, []);

  // Update color and add to history
  const updateColor = useCallback((newColor) => {
    setColor(newColor);
    setCustomColor(newColor);

    // Add to color history if it's not already the most recent color
    setColorHistory(prevHistory => {
      if (prevHistory[0] !== newColor) {
        // Add to the beginning and limit to 10 colors
        const newHistory = [newColor, ...prevHistory.filter(c => c !== newColor)].slice(0, 10);
        return newHistory;
      }
      return prevHistory;
    });
  }, []);



  // Handle mode change
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  // Handle tool change is directly implemented in the shape buttons

  // Handle the analyze action
  const handleAnalyze = useCallback(async () => {
    if (!hasDrawn) {
      setError('Please draw something on the canvas first');
      return;
    }

    // Clear any previous errors and set loading state
    setError(null);
    setIsAnalyzing(true);
    setRetrievedImages([]);

    try {
      const tempCanvas = createWhiteBackgroundImage();
      if (!tempCanvas) {
        throw new Error('Failed to create image from canvas');
      }

      const dataUrl = tempCanvas.toDataURL('image/png');
      const imageBase64 = dataUrl.split(',')[1]; // Extract base64 data after the comma

      if (imageBase64.length === 0) {
        throw new Error('Canvas is empty or failed to convert to base64');
      }

      // Convert the canvas to a Blob
      const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/png'));

      // Send request to API using the imageService
      const response = await imageService.findSimilar(blob);
      const data = response.data;

      // Handle different response formats
      if (data.similar_images && data.similar_images.length > 0) {
        setRetrievedImages(data.similar_images);
      } else if (data.results && data.results.length > 0) {
        const formattedResults = data.results.map(item => ({
          image: item.image || item.url || '',
          similarity: item.similarity || item.score || 0.5
        }));
        setRetrievedImages(formattedResults);
      } else if (Array.isArray(data)) {
        const formattedResults = data.map(item => ({
          image: typeof item === 'string' ? item : (item.image || item.url || ''),
          similarity: item.similarity || item.score || 0.5
        }));
        setRetrievedImages(formattedResults);
      } else {
        setRetrievedImages([]);
        setError('No similar designs found. Try drawing something different.');
      }
    } catch (err) {
      console.error('Error fetching similar images:', err);

      // Determine appropriate error message
      let errorMessage = '';
      if (err.message.includes('No image provided')) {
        errorMessage = 'The API could not find the image data. Please try drawing something more visible.';
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Please check if the API server is running at http://127.0.0.1:5000';
      } else if (err.message.includes('Canvas is empty')) {
        errorMessage = 'Please draw something on the canvas before searching for inspirations.';
      } else {
        errorMessage = `Failed to analyze sketch: ${err.message}`;
      }

      setRetrievedImages([]);
      setError(errorMessage);
    } finally {
      // Always reset loading state when done
      setIsAnalyzing(false);
    }
  }, [hasDrawn, createWhiteBackgroundImage, imageService]);

  return (
    <motion.div
      className="sketch-page"
      initial="hidden"
      animate="visible"
      variants={animations.container}
    >
      {/* Main Content */}
      <motion.main className="sketch-main" variants={animations.item}>
        {/* Tools Panel */}
        <motion.section className="sketch-tools-panel" variants={animations.item}>
          <motion.h2 className="section-title" variants={animations.item}>Product Design Tools</motion.h2>
          <motion.div className="tools-content" variants={animations.item}>
            {/* Mode Selection */}
            <div className="tool-group">
              <h3 className="tool-group-title">Mode</h3>
              <div className="mode-buttons">
                <ButtonGroup>
                  <Button
                    onClick={() => handleModeChange('draw')}
                    active={mode === 'draw'}
                  >
                    Draw
                  </Button>
                  <Button
                    onClick={() => handleModeChange('select')}
                    active={mode === 'select'}
                  >
                    Select
                  </Button>
                </ButtonGroup>
              </div>
            </div>

            {/* Color & Stroke Section */}
            <div className="tool-group">
              <h3 className="tool-group-title">Color & Stroke</h3>
              <div className="color-picker-wrapper">
                <div className="color-picker-header">
                  <div className="color-picker-title">Color</div>
                  {/* <div
                    className="current-color-swatch"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div> */}
                </div>
                <div className="color-picker-container">
                  <div className="custom-color-input-container">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => {
                        handleCustomColorChange(e);
                        if (/^#[0-9A-F]{6}$/i.test(e.target.value) || /^#[0-9A-F]{3}$/i.test(e.target.value)) {
                          updateColor(e.target.value);
                        }
                      }}
                      placeholder="#RRGGBB"
                      className="custom-color-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (/^#[0-9A-F]{6}$/i.test(customColor) || /^#[0-9A-F]{3}$/i.test(customColor))) {
                          e.preventDefault();
                          updateColor(customColor);
                        }
                      }}
                    />
                    <label className="color-picker-button" title="Open color picker">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(e.target.value)}
                        className="hidden-color-input"
                      />
                      <div className="color-picker-icon">
                        <span>🎨</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="slider-wrapper">
                <Slider
                  label="Stroke Weight"
                  value={brushSize}
                  onChange={setBrushSize}
                  min={1}
                  max={50}
                />
              </div>
              <div className="eraser-toggle-wrapper">
                <ToggleButton
                  label="Switch to Eraser"
                  isActive={isErasing}
                  onClick={() => setIsErasing(!isErasing)}
                  icon="🧹"
                />
              </div>
            </div>

            {/* Shape Tools Section */}
            <div className="tool-group">
              <h3 className="tool-group-title">Product Elements</h3>
              <div className="shape-tools-grid">
                <ButtonGroup>
                  <ToggleButton
                    label="Freehand"
                    isActive={shape === 'freehand'}
                    onClick={() => setShape('freehand')}
                    icon="✏️"
                  />
                  <ToggleButton
                    label="Line"
                    isActive={shape === 'line'}
                    onClick={() => setShape('line')}
                    icon="⁄"
                  />
                  <ToggleButton
                    label="Rectangle"
                    isActive={shape === 'rectangle'}
                    onClick={() => setShape('rectangle')}
                    icon="□"
                  />
                  <ToggleButton
                    label="Circle"
                    isActive={shape === 'circle'}
                    onClick={() => setShape('circle')}
                    icon="○"
                  />
                </ButtonGroup>
              </div>
            </div>

            {/* History Section */}
            <div className="tool-group">
              <h3 className="tool-group-title">History</h3>
              <div className="history-buttons">
                <ButtonGroup>
                  <Button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    title="Undo"
                  >
                    ↩️ Undo
                  </Button>
                  <Button
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    title="Redo"
                  >
                    ↪️ Redo
                  </Button>
                </ButtonGroup>
              </div>
            </div>

            {/* Actions Section */}
            <div className="tool-group actions-group">
              <h3 className="tool-group-title">Actions</h3>
              <div className="action-buttons">
                <Button
                  onClick={clearCanvas}
                  fullWidth
                >
                  Clear Canvas
                </Button>
                <Button
                  onClick={downloadSketch}
                  fullWidth
                  className="mt-2"
                >
                  Export Concept
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Canvas Section */}
        <motion.section className="sketch-canvas-section" variants={animations.item}>
          <motion.h2 className="section-title" variants={animations.item}>Product Concept Canvas</motion.h2>
          <motion.p className="canvas-note" variants={animations.item}>Note: Currently only works with umbrella and watch products.</motion.p>
          <motion.div
            className="canvas-container"
            variants={animations.item}
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
          >
            <canvas
              ref={canvasRef}
              width={650}
              height={650}
              className={`drawing-canvas ${mode === 'select' ? 'select-mode' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = e.target.getBoundingClientRect();
                const mouseEvent = {
                  nativeEvent: {
                    offsetX: touch.clientX - rect.left,
                    offsetY: touch.clientY - rect.top
                  }
                };
                handleMouseDown(mouseEvent);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = e.target.getBoundingClientRect();
                const mouseEvent = {
                  nativeEvent: {
                    offsetX: touch.clientX - rect.left,
                    offsetY: touch.clientY - rect.top
                  }
                };
                handleMouseMove(mouseEvent);
              }}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
            />
          </motion.div>
          <motion.div className="canvas-actions" variants={animations.item}>
            <motion.div variants={animations.item}>
              <Button
                variant="primary"
                size="large"
                onClick={handleAnalyze}
                disabled={!hasDrawn || isAnalyzing}
                className="animate-button"
              >
                {isAnalyzing ? 'Analyzing...' : 'Find Similar Products'}
              </Button>
            </motion.div>
          </motion.div>
          {error && (
            <motion.div
              className="error-container"
              variants={animations.item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div className="error-message" variants={animations.item}>
                <span className="error-icon">⚠️</span> {error}
              </motion.div>
            </motion.div>
          )}
        </motion.section>

        {/* Results Section */}
        <motion.section className="sketch-results-section" variants={animations.item}>
          <motion.h2 className="section-title" variants={animations.item}>Market Research Gallery</motion.h2>
          <motion.div
            className="results-container"
            variants={animations.item}
          >
            {isAnalyzing ? (
              <motion.div
                className="loading-wrapper card"
                variants={animations.item}
              >
                <Loading size="large" text="Analyzing sketch and finding similar products..." />
              </motion.div>
            ) : retrievedImages.length > 0 ? (
              <motion.div
                className="image-grid"
                variants={animations.item}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {retrievedImages.map((image, index) => (
                  <motion.div
                    key={index}
                    className="image-item"
                    variants={animations.item}
                    custom={index}
                  >
                    <ImageCard
                      imageUrl={typeof image.image === 'string' ?
                        (image.image.startsWith('data:') ? image.image : `data:image/png;base64,${image.image}`) :
                        ''
                      }
                      altText={`Retrieved ${index}`}
                      similarity={image.similarity}
                      showSimilarity
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="empty-state"
                variants={animations.item}
              >
                {error ? (
                  <motion.p className="error-text" variants={animations.item}>{error}</motion.p>
                ) : (
                  <>
                    <motion.h3 variants={animations.item}>Market Research Awaits</motion.h3>
                    <motion.p variants={animations.item}>Sketch your product concept and click "Find Similar Products" to discover existing market solutions and design inspirations</motion.p>
                    <motion.p className="upload-note" variants={animations.item}>Note: Currently only works with umbrella and watch products</motion.p>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.section>
      </motion.main>
    </motion.div>
  );
};

export default SketchPage;