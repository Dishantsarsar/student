import React from 'react';

function UserAvatar({ initials, isOnline = false, size = 48 }) {
  return (
    <div className="premium-avatar-wrapper" style={{ width: size, height: size }}>
      <div className="premium-avatar" style={{ width: size, height: size }}>
        {initials}
      </div>
      {isOnline && <div className="premium-avatar-status" />}
    </div>
  );
}

export default React.memo(UserAvatar);
