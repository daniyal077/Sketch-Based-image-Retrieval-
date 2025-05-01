import React from 'react';
import './ToggleButton.css';

const ToggleButton = ({ 
  label, 
  isActive, 
  onClick, 
  icon = null,
  disabled = false
}) => {
  return (
    <button
      className={`toggle-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon && <span className="toggle-icon">{icon}</span>}
      {label && <span className="toggle-label">{label}</span>}
    </button>
  );
};

export default ToggleButton;
