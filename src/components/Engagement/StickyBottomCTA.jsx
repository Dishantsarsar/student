import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Engagement.css';

function StickyBottomCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const location = useLocation();

  // Only show on home page or specific landing pages, not in admin or auth
  const isEligiblePage = location.pathname === '/';
  const isAuth = !!localStorage.getItem('sa_user');

  useEffect(() => {
    if (isDismissed || !isEligiblePage || isAuth) return;

    let ticking = false;

    const updateVisibility = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const scrollPercent = (scrolled / docHeight) * 100;
        if (scrollPercent > 50) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed, isEligiblePage, isAuth]);

  if (!isVisible || isDismissed || !isEligiblePage || isAuth) return null;

  return (
    <div className="sticky-bottom-cta slide-up">
      <div className="sticky-cta-content">
        <div className="sticky-cta-text">
          <h3>🚀 Start Learning Today — Join Thousands of Students</h3>
        </div>
        <div className="sticky-cta-buttons">
          <Link to="/courses" className="btn-primary">Explore Courses</Link>
          <Link to="/auth?tab=signup" className="btn-secondary">Sign Up Free</Link>
          <button className="sticky-close" onClick={() => setIsDismissed(true)} aria-label="Close">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default StickyBottomCTA;
