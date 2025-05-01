import React from 'react';
import './styles.css';

function Loading({ size = 'medium', text = 'Loading...' }) {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

export default Loading;
