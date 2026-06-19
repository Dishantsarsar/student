import React from 'react';
import { Link } from 'react-router-dom';

function MenuItem({ icon: Icon, label, to, onClick, className = '' }) {
  return (
    <Link to={to} className={`premium-menu-item ${className}`} onClick={onClick}>
      <span className="premium-menu-icon">
        <Icon size={18} />
      </span>
      <span className="premium-menu-text">{label}</span>
    </Link>
  );
}

export default React.memo(MenuItem);
