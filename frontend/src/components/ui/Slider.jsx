import React from 'react';
import './Slider.css';

const Slider = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  showValue = true
}) => {
  return (
    <div className="slider-container">
      <div className="slider-header">
        {label && <label className="slider-label">{label}</label>}
        {showValue && <span className="slider-value">{value}</span>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="slider-input"
      />
      <div className="slider-ticks">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;
