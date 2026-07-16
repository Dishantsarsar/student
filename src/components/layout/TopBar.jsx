import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import Avatar from '../ui/Avatar';
import './TopBar.css';

function TopBar({ toggleSidebar }) {
  return (
    <header className="premium-topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search courses, discussions..." />
          <div className="search-shortcut">⌘K</div>
        </div>
      </div>
      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        <div className="user-profile">
          <Avatar name="Student User" size="sm" />
          <div className="user-info">
            <span className="user-name">Student</span>
            <span className="user-role">Pro Member</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
