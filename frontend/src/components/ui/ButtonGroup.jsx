import React from 'react';
import './ButtonGroup.css';

const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`button-group ${className}`}>
      {children}
    </div>
  );
};

export default ButtonGroup;
