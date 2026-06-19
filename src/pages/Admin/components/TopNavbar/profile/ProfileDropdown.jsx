import React from 'react';
import { User, Settings, Bell, HelpCircle } from 'lucide-react';
import UserHeader from './UserHeader.jsx';
import MenuItem from './MenuItem.jsx';
import Divider from './Divider.jsx';
import LogoutButton from './LogoutButton.jsx';

function ProfileDropdown({ isOpen, onClose }) {
  // Prevent clicks inside the dropdown from propagating up and immediately closing it
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`premium-profile-dropdown ${isOpen ? 'open' : ''}`}
      onClick={handleDropdownClick}
      role="menu"
      aria-orientation="vertical"
    >
      <UserHeader 
        initials="DS" 
        name="Dishant" 
        role="Super Admin" 
        email="dishant@solutionadda.com" 
      />
      
      <Divider />
      
      <div role="group">
        <MenuItem icon={User} label="My Profile" to="/admin/profile" onClick={onClose} />
        <MenuItem icon={Settings} label="Account Settings" to="/admin/settings" onClick={onClose} />
        <MenuItem icon={Bell} label="Notifications" to="/admin/notifications" onClick={onClose} />
        <MenuItem icon={HelpCircle} label="Help Center" to="/admin/support" onClick={onClose} />
      </div>

      <Divider />

      <LogoutButton onClick={onClose} />
    </div>
  );
}

export default React.memo(ProfileDropdown);
