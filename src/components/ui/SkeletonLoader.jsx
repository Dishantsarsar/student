import React from 'react';
import './SkeletonLoader.css';

/* Shimmer loading placeholder */
function SkeletonLoader({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export default SkeletonLoader;
