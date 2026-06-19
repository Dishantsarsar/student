import React from 'react';
import UserAvatar from './UserAvatar.jsx';

function UserHeader({ initials, name, role, email }) {
  return (
    <div className="dropdown-user-header">
      <UserAvatar initials={initials} size={48} />
      <span className="premium-user-name">{name}</span>
      <span className="premium-user-role">{role}</span>
      <span className="dropdown-user-email">{email}</span>
    </div>
  );
}

export default React.memo(UserHeader);
