import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'medium', 
  disabled = false, 
  fullWidth = false,
  loading = false,
  className = '',
  type = 'button'
}) => {
  const buttonClass = `
    ui-button 
    ${variant} 
    ${size} 
    ${fullWidth ? 'full-width' : ''} 
    ${loading ? 'loading' : ''} 
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="button-loader"></span>
      ) : children}
    </button>
  );
};

export default Button;
