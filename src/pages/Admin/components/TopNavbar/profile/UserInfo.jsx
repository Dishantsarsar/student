import React from 'react';

function UserInfo({ name, role }) {
  return (
    <div className="premium-user-info">
      <span className="premium-user-name">{name}</span>
      <span className="premium-user-role">{role}</span>
    </div>
  );
}

export default React.memo(UserInfo);
