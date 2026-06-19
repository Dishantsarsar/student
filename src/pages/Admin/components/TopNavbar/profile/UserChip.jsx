import React from 'react';
import { ChevronDown } from 'lucide-react';
import UserAvatar from './UserAvatar.jsx';
import UserInfo from './UserInfo.jsx';

function UserChip({ onClick, isOpen }) {
  return (
    <button 
      className="premium-user-chip" 
      onClick={onClick}
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      <UserAvatar initials="DS" isOnline={true} size={40} />
      <UserInfo name="Dishant" role="Super Admin" />
      <ChevronDown size={16} className="chevron-icon" />
    </button>
  );
}

export default React.memo(UserChip);
