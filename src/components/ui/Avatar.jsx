import React from 'react';
import './Avatar.css';

function Avatar({ src, alt, size = 'md', name, className = '', fallbackClassName = '' }) {
  const getInitials = (n) => {
    if (!n) return '';
    return n.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className={`premium-avatar avatar-${size} ${className}`}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className="avatar-image" />
      ) : (
        <div className={`avatar-fallback ${fallbackClassName}`}>
          {getInitials(name) || '?'}
        </div>
      )}
      <div className="avatar-ring" />
    </div>
  );
}

export default Avatar;
