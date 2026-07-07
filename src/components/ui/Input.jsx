import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ label, error, icon, className = '', containerClassName = '', ...props }, ref) => {
  return (
    <div className={`premium-input-container ${containerClassName}`}>
      {label && <label className="premium-input-label">{label}</label>}
      <div className="premium-input-wrapper">
        {icon && <span className="premium-input-icon">{icon}</span>}
        <input
          ref={ref}
          className={`premium-input ${icon ? 'has-icon' : ''} ${error ? 'has-error' : ''} ${className}`}
          {...props}
        />
        <div className="premium-input-focus-ring" />
      </div>
      {error && <span className="premium-input-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
