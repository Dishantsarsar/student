import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardSidebar.css';

const navItems = [
  { id: 'home',          icon: '🏠', label: 'Dashboard' },
  { id: 'courses',       icon: '📚', label: 'My Courses' },
  { id: 'analytics',     icon: '📈', label: 'Analytics' },
  { id: 'achievements',  icon: '🏆', label: 'Achievements' },
  { id: 'certificates',  icon: '🎖️', label: 'Certificates' },
  { id: 'wishlist',      icon: '❤️', label: 'Wishlist' },
  { id: 'assignments',   icon: '📝', label: 'Assignments' },
  { id: 'projects',      icon: '📂', label: 'Projects' },
  { id: 'calendar',      icon: '📅', label: 'Calendar' },
  { id: 'community',     icon: '💬', label: 'Community' },
  { id: 'career',        icon: '🚀', label: 'Career' },
  { id: 'settings',      icon: '⚙️', label: 'Settings' },
];

const comingSoonIds = ['assignments', 'projects', 'calendar', 'community', 'career'];

function DashboardSidebar({ activeSection, setActiveSection, currentUser, enrolledCount }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 1024) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleNav = (id) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className={`sidebar-mobile-toggle ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <span /><span /><span />
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`dash-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Collapse Toggle (Desktop) */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Collapse sidebar"
        >
          {collapsed ? '›' : '‹'}
        </button>

        {/* User Mini Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">
            {currentUser?.name?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {currentUser?.name?.split(' ')[0] || 'Student'}
              </div>
              <div className="sidebar-user-role">
                <span className="sidebar-role-dot" />
                Student
              </div>
            </div>
          )}
        </div>

        {/* XP Bar (desktop only) */}
        {!collapsed && (
          <div className="sidebar-xp-bar">
            <div className="sidebar-xp-label">
              <span>⚡ XP</span>
              <span className="sidebar-xp-val">1,240 / 2,000</span>
            </div>
            <div className="sidebar-xp-track">
              <div className="sidebar-xp-fill" style={{ width: '62%' }} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isCS = comingSoonIds.includes(item.id);
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''} ${isCS ? 'cs-item' : ''}`}
                onClick={() => handleNav(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="sidebar-nav-label">{item.label}</span>
                    {isCS && <span className="sidebar-cs-dot" title="Coming Soon" />}
                    {item.id === 'courses' && enrolledCount > 0 && (
                      <span className="sidebar-count-badge">{enrolledCount}</span>
                    )}
                  </>
                )}
                {activeSection === item.id && <span className="sidebar-active-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-bottom">
          <button className="sidebar-logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
            <span>🚪</span>
            {!collapsed && <span>Log Out</span>}
          </button>
          {!collapsed && (
            <div className="sidebar-version">Solution Adda v2.0</div>
          )}
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;
