import React from 'react';
import './AnimatedBackground.css';

/* Reusable animated mesh/aurora background with floating particles */
function AnimatedBackground({ variant = 'default', className = '' }) {
  return (
    <div className={`animated-bg animated-bg-${variant} ${className}`}>
      <div className="aurora-orb aurora-1" />
      <div className="aurora-orb aurora-2" />
      <div className="aurora-orb aurora-3" />
      <div className="mesh-grid" />
      {/* Floating particles */}
      <div className="particles-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              opacity: 0.15 + Math.random() * 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AnimatedBackground;
