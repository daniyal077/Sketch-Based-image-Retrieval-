import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">DesignFlow</h3>
          <p className="footer-description">
            A professional design tool for product designers to find inspiration and enhance their creative process.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Features</h4>
          <ul className="footer-list">
            <li>Sketch-based design inspiration</li>
            <li>Design asset management</li>
            <li>Generate design descriptions</li>
            <li>Professional design editing tools</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-nav">
            <li><button onClick={() => navigate('/')}>Home</button></li>
            <li><button onClick={() => navigate('/sketch')}>Design Sketch</button></li>
            <li><button onClick={() => navigate('/upload-img')}>Image Search</button></li>
            <li><button onClick={() => navigate('/generate_text')}>Generate Description</button></li>
            <li><button onClick={() => navigate('/edit_image')}>Design Editor</button></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {currentYear} DesignFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
