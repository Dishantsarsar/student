import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import './StatCard.css';

/* Animated counter hook */
function useCounter(end, duration = 1500, startAnimating = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end <= 0 || !startAnimating) return;
    let start = 0;
    const increment = Math.ceil(end / 40);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, duration / 40);
    return () => clearInterval(timer);
  }, [end, duration, startAnimating]);
  return count;
}

/* Premium statistics card with animated counter, icon, trend, mini sparkline */
function StatCard({ icon, label, value, suffix = '', trend, trendValue, gradient = 'cyan', className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const animatedValue = useCounter(typeof value === 'number' ? value : 0, 1500, isInView);
  const displayValue = typeof value === 'number' ? animatedValue.toLocaleString() : value;

  const gradientMap = {
    cyan: 'linear-gradient(135deg, rgba(0,242,254,0.15), rgba(79,172,254,0.15))',
    magenta: 'linear-gradient(135deg, rgba(252,0,255,0.15), rgba(79,172,254,0.15))',
    green: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(0,242,254,0.15))',
    orange: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(252,0,255,0.15))',
    blue: 'linear-gradient(135deg, rgba(79,172,254,0.15), rgba(0,242,254,0.15))',
  };

  return (
    <div ref={ref} className={`stat-card-premium ${className}`}>
      <div className="stat-card-icon" style={{ background: gradientMap[gradient] || gradientMap.cyan }}>
        <span>{icon}</span>
      </div>
      <div className="stat-card-info">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{displayValue}{suffix}</span>
        {trend && (
          <span className={`stat-card-trend trend-${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      {/* Mini sparkline decoration */}
      <div className="stat-card-sparkline">
        <svg viewBox="0 0 80 30" preserveAspectRatio="none">
          <polyline
            points="0,25 10,20 20,22 30,15 40,18 50,10 60,12 70,5 80,8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
}

export default StatCard;
