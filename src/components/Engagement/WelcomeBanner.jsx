import React, { useState, useEffect } from 'react';
import './Engagement.css';

function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('welcome_seen')) {
      setIsVisible(true);
      sessionStorage.setItem('welcome_seen', 'true');
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 7000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <span className="welcome-icon">👋</span>
        <p>Welcome to Solution Adda! Explore industry-ready courses and build your future.</p>
        <button className="welcome-close" onClick={() => setIsVisible(false)} aria-label="Close">
          ✕
        </button>
      </div>
    </div>
  );
}

export default WelcomeBanner;
