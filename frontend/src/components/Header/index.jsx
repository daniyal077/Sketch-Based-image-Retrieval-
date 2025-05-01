import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/sketch', label: 'Design Sketch' },
    { path: '/upload-img', label: 'Image Search' },
    { path: '/generate_text', label: 'Generate Description' },
    { path: '/edit_image', label: 'Design Editor' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container" onClick={() => navigate('/')}>
          <h1 className="logo">DesignFlow</h1>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-btn ${isActive(item.path)}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
