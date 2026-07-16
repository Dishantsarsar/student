import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Courses', icon: <BookOpen size={20} />, path: '/dashboard/courses' },
    { name: 'Community', icon: <Users size={20} />, path: '/dashboard/community' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  return (
    <aside className="premium-sidebar">
      <div className="sidebar-logo">
        <span className="logo-text">Solution Adda</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/dashboard'}
          >
            {item.icon}
            <span className="nav-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
