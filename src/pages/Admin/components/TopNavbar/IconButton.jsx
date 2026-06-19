import React from 'react';

function IconButton({ icon: Icon, onClick, className = '', children }) {
  return (
    <button className={`navbar-icon-btn ${className}`} onClick={onClick}>
      <Icon size={20} />
      {children}
    </button>
  );
}

export default IconButton;
