import React, { useState, useEffect } from 'react';
import './Engagement.css';

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const scrollPercent = (scrolled / docHeight) * 100;
        setProgress(scrollPercent);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="reading-progress-container">
      <div 
        className="reading-progress-bar" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ReadingProgress;
