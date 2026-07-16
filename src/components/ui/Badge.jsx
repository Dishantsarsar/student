import React from 'react';
import './Badge.css';

/* Status badge: success, warning, info, admin, user, danger */
function Badge({ children, variant = 'info', size = 'sm', dot = false, outline = false, icon }) {
  return (
    <span className={`premium-badge badge-${variant} badge-size-${size} ${outline ? 'badge-outline' : ''}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export default Badge;
