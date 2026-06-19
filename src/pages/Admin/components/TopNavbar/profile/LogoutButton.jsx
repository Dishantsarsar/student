import React from 'react';
import { LogOut } from 'lucide-react';
import MenuItem from './MenuItem.jsx';

function LogoutButton({ onClick }) {
  return (
    <MenuItem 
      icon={LogOut} 
      label="Logout" 
      to="/" 
      onClick={onClick} 
      className="logout-btn" 
    />
  );
}

export default React.memo(LogoutButton);
