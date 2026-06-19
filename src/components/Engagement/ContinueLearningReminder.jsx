import React, { useState, useEffect } from 'react';
import './Engagement.css';

function ContinueLearningReminder() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(
    sessionStorage.getItem('continue_learning_dismissed') === 'true'
  );
  const isAuth = !!localStorage.getItem('sa_user');

  useEffect(() => {
    if (isAuth || isDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 45000); // 45 seconds

    return () => clearTimeout(timer);
  }, [isAuth, isDismissed]);

  if (!isVisible || isDismissed || isAuth) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('continue_learning_dismissed', 'true');
  };

  return (
    <div className={`learning-tips-widget fade-in`} style={{ bottom: '100px' }}>
      <div className="learning-tips-content">
        <p>⭐ Create a free account to save your progress and continue learning anytime.</p>
        <button className="tips-close" onClick={handleDismiss} aria-label="Close reminder">
          ✕
        </button>
      </div>
    </div>
  );
}

export default ContinueLearningReminder;
