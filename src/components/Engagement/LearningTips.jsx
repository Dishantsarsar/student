import React, { useState, useEffect } from 'react';
import './Engagement.css';

const tips = [
  "💡 Tip: Learn by building projects.",
  "💡 Tip: Practice daily.",
  "💡 Tip: Projects improve portfolios.",
  "💡 Tip: Consistency beats intensity."
];

function LearningTips() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(
    sessionStorage.getItem('learning_tips_dismissed') === 'true'
  );

  useEffect(() => {
    if (isDismissed) return;

    // Initial delay before showing first tip
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % tips.length);
        setIsVisible(true);
      }, 500);
    }, 14000); // 14 seconds

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('learning_tips_dismissed', 'true');
  };

  return (
    <div className={`learning-tips-widget ${isVisible ? 'fade-in' : 'fade-out'}`}>
      <div className="learning-tips-content">
        <p>{tips[currentIndex]}</p>
        <button className="tips-close" onClick={handleDismiss} aria-label="Close tip">
          ✕
        </button>
      </div>
    </div>
  );
}

export default LearningTips;
