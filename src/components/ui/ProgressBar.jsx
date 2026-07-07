import React from 'react';
import './ProgressBar.css';

function ProgressBar({ progress, label, showValue = true, size = 'md', variant = 'primary', className = '' }) {
  const normalizedProgress = Math.min(100, Math.max(0, progress || 0));
  
  return (
    <div className={`premium-progress-container ${className}`}>
      {(label || showValue) && (
        <div className="premium-progress-header">
          {label && <span className="premium-progress-label">{label}</span>}
          {showValue && <span className="premium-progress-value">{Math.round(normalizedProgress)}%</span>}
        </div>
      )}
      <div className={`premium-progress-track size-${size}`}>
        <div 
          className={`premium-progress-fill variant-${variant}`} 
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
