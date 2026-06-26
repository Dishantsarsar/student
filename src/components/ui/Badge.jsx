import React from 'react';
import './Badge.css';

/* Status badge: success, warning, info, admin, user, danger */
function Badge({ children, variant = 'info', size = 'sm', dot = false }) {
  return (
    <span className={`premium-badge badge-${variant} badge-size-${size}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export default Badge;
