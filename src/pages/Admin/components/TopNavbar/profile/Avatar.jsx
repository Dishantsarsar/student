import React from 'react';

function Avatar({ initials, isOnline = false }) {
  return (
    <div className="premium-avatar-wrapper">
      <div className="premium-avatar">{initials}</div>
      {isOnline && <div className="premium-avatar-status" />}
    </div>
  );
}

export default React.memo(Avatar);
