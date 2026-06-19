import React, { useState, useEffect } from 'react';
import './Engagement.css';

const activities = [
  "🔥 150+ students currently learning",
  "🎓 10,000+ learners enrolled",
  "⭐ 4.9 average rating",
  "🚀 500+ projects completed"
];

function LiveActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // Fade out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true); // Fade in
      }, 500); // 500ms transition time
    }, 8500); // Rotates every 8.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`live-activity-widget ${isVisible ? 'fade-in' : 'fade-out'}`}>
      <div className="live-activity-content">
        <span className="live-pulse"></span>
        <p>{activities[currentIndex]}</p>
      </div>
    </div>
  );
}

export default LiveActivity;
