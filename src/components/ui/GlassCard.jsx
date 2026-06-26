import React from 'react';
import './GlassCard.css';

/* Premium glassmorphism card with optional glow, hover tilt, and animated border */
function GlassCard({ children, className = '', glow = false, hover = true, onClick, style }) {
  return (
    <div
      className={`glass-card ${glow ? 'glass-glow' : ''} ${hover ? 'glass-hover' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

export default GlassCard;
