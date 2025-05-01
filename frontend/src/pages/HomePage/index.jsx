import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './index.css';

// Import the logo
const designFlowLogo = "/assets/designflow.png";

// Feature data tailored for product designers
const features = [
  {
    icon: <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>,
    title: "Concept Sketching",
    description: "Sketch product concepts and get AI-powered suggestions to accelerate your ideation process."
  },
  {
    icon: <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" /></svg>,
    title: "Reference Matching",
    description: "Upload reference products to find similar designs and analyze market trends for your design research."
  },
  {
    icon: <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z" /></svg>,
    title: "Design Documentation",
    description: "Generate professional product specifications from your design assets for presentations and handoffs."
  },
  {
    icon: <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M7,14A2,2 0 0,1 5,12A2,2 0 0,1 7,10A2,2 0 0,1 9,12A2,2 0 0,1 7,14M12.65,10C11.83,7.67 9.61,6 7,6A6,6 0 0,0 1,12A6,6 0 0,0 7,18C9.61,18 11.83,16.33 12.65,14H17V18H21V14H23V10H12.65Z" /></svg>,
    title: "Visual Refinement",
    description: "Polish your product visuals with professional editing tools for color, contrast, and visual optimization."
  }
];

function HomePage() {
  // Animation variants - simplified
  const animations = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.8, staggerChildren: 0.2 }
      }
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: (i) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, delay: i * 0.1 || 0 }
      })
    },
    button: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    },
    image: {
      animate: {
        scale: [1, 1.03, 1],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
    }
  };

  return (
    <motion.div
      className="homepage"
      initial="hidden"
      animate="visible"
      variants={animations.container}
    >
      {/* Hero Section */}
      <div className="hero-content">
        <motion.div className="hero-left" variants={animations.item}>
          <motion.h1 className="hero-title" variants={animations.item}>
            Product Design Studio <span className="highlight">DesignFlow</span>
          </motion.h1>
          <motion.p className="hero-description" variants={animations.item}>
            Accelerate your product design workflow with AI-powered tools for ideation, concept validation, and design exploration. Transform sketches into professional assets and find inspiration from similar products.
          </motion.p>
          <motion.div className="hero-buttons" variants={animations.item}>
            <Link to="/sketch">
              <motion.button
                className="btn btn-primary btn-lg"
                whileHover="hover"
                whileTap="tap"
                variants={animations.button}
              >
                Concept Sketching
              </motion.button>
            </Link>
            <Link to="/upload-img">
              <motion.button
                className="btn btn-secondary btn-lg"
                whileHover="hover"
                whileTap="tap"
                variants={animations.button}
              >
                Reference Matching
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="hero-right" variants={animations.item}>
          <motion.img
            src={designFlowLogo}
            alt="DesignFlow Logo"
            className="hero-image"
            animate="animate"
            variants={animations.image}
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div className="features-section" variants={animations.item}>
        <motion.h2 className="section-title" variants={animations.item}>Product Design Tools</motion.h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={animations.item}
              custom={index}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HomePage;