import React from 'react';
import { Bell } from 'lucide-react';
import IconButton from './IconButton.jsx';

function NotificationButton({ hasUnread = true, onClick }) {
  return (
    <IconButton icon={Bell} onClick={onClick}>
      {hasUnread && <span className="navbar-notification-badge" />}
    </IconButton>
  );
}

export default NotificationButton;
