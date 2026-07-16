import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { coursesData } from '../../coursesData';
import './Admin.css';

// --- Sub-Tab Components ---

const DashboardTab = ({ users }) => {
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="tab-title">Platform Overview</h2>
      <div className="admin-stats-grid">
        <StatCard icon="👥" label="Total Users" value={users.length} gradient="cyan" />
        <StatCard icon="🛡️" label="Admins" value={adminCount} gradient="magenta" />
        <StatCard icon="🎓" label="Students" value={userCount} gradient="blue" />
        <StatCard icon="📚" label="Total Courses" value={coursesData.length} gradient="green" />
      </div>
      
      <div className="admin-dashboard-split">
        <GlassCard className="recent-activity">
          <h3>Recent Registrations</h3>
          {users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <ul className="activity-list">
              {users.slice(-5).reverse().map((u, i) => (
                <li key={i}>
                  <div className="activity-icon">👤</div>
                  <div className="activity-details">
                    <p><strong>{u.name}</strong> joined the platform</p>
                    <span>{u.email}</span>
                  </div>
                  <Badge variant={u.role === 'admin' ? 'admin' : 'user'} size="xs">{u.role}</Badge>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
        
        <GlassCard className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Button variant="secondary" onClick={() => alert('Mock: Create Course Modal opened.')}>+ Create New Course</Button>
            <Button variant="secondary" onClick={() => alert('Mock: Invite Admin Modal opened.')}>+ Invite Admin</Button>
            <Button variant="secondary" onClick={() => alert('Mock: Generate Report initiated.')}>📥 Generate Report</Button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

const UsersTab = ({ users }) => {
  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="tab-header">
        <h2 className="tab-title">User Management</h2>
        <Button variant="primary" size="sm">+ Add User</Button>
      </div>
      <GlassCard className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan="5"><EmptyState icon="👥" title="No users yet" description="Wait for users to register." /></td></tr>
              )}
              {users.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div className="table-user">
                      <div className="table-avatar">{u.name.charAt(0).toUpperCase()}</div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><Badge variant={u.role === 'admin' ? 'admin' : 'user'}>{u.role}</Badge></td>
                  <td><Badge variant="success" dot>Active</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn edit">✏️</button>
                      <button className="action-btn delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const CoursesTab = () => {
  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="tab-header">
        <h2 className="tab-title">Course Catalog</h2>
        <Button variant="primary" size="sm">+ New Course</Button>
      </div>
      <div className="admin-courses-grid">
        {coursesData.map((course, idx) => (
          <GlassCard key={idx} hover={false} className="admin-course-card">
            <div className="admin-course-head">
              <span className="course-emoji">{course.emoji}</span>
              <div className="course-actions">
                <button className="action-btn edit">✏️</button>
                <button className="action-btn delete">🗑️</button>
              </div>
            </div>
            <h4>{course.title}</h4>
            <div className="course-meta">
              <Badge variant="info" size="xs">{course.level}</Badge>
              <span className="text-muted text-xs">{course.duration}</span>
            </div>
            <div className="course-stats">
              <div className="c-stat"><span>Enrolled</span><strong>{Math.floor(Math.random() * 500) + 50}</strong></div>
              <div className="c-stat"><span>Rating</span><strong>4.{Math.floor(Math.random() * 9) + 1} ⭐</strong></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
};

const AnalyticsTab = () => {
  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="tab-title">Platform Analytics</h2>
      <div className="charts-grid">
        <GlassCard className="chart-card">
          <h3>Revenue Overview (Mock)</h3>
          <div className="pure-css-chart">
            <div className="bar-wrap"><div className="bar" style={{ height: '40%' }}></div><span>Jan</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '70%' }}></div><span>Feb</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '50%' }}></div><span>Mar</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '90%' }}></div><span>Apr</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '60%' }}></div><span>May</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '85%' }}></div><span>Jun</span></div>
          </div>
        </GlassCard>
        
        <GlassCard className="chart-card">
          <h3>Enrollment Trends</h3>
          <div className="pure-css-chart area-chart">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0, 242, 254, 0.5)" />
                <stop offset="100%" stopColor="rgba(0, 242, 254, 0)" />
              </linearGradient>
              <path d="M0,100 L0,60 L20,40 L40,70 L60,30 L80,50 L100,20 L100,100 Z" fill="url(#areaGrad)" />
              <polyline points="0,60 20,40 40,70 60,30 80,50 100,20" fill="none" stroke="#00f2fe" strokeWidth="2" />
            </svg>
            <div className="chart-labels">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

const NotificationsTab = () => {
  const mockNotifs = [
    { id: 1, type: 'alert', title: 'High Traffic Alert', desc: 'Server load reached 85% at 14:00 UTC.', time: '2 hours ago' },
    { id: 2, type: 'info', title: 'System Update', desc: 'Version 2.4 deployed successfully.', time: '5 hours ago' },
    { id: 3, type: 'success', title: 'New Revenue Milestone', desc: 'Platform crossed 10k MRR.', time: '1 day ago' },
    { id: 4, type: 'alert', title: 'Failed Login Attempts', desc: 'Multiple failed logins detected for user admin@test.com.', time: '2 days ago' }
  ];

  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="tab-header">
        <h2 className="tab-title">System Notifications</h2>
        <Button variant="ghost" size="sm">Mark all as read</Button>
      </div>
      <GlassCard className="notifications-list">
        {mockNotifs.map(n => (
          <div key={n.id} className={`notif-item ${n.type}`}>
            <div className="notif-icon">
              {n.type === 'alert' && '⚠️'}
              {n.type === 'info' && 'ℹ️'}
              {n.type === 'success' && '🎉'}
            </div>
            <div className="notif-content">
              <h4>{n.title}</h4>
              <p>{n.desc}</p>
              <span className="notif-time">{n.time}</span>
            </div>
          </div>
        ))}
      </GlassCard>
    </motion.div>
  );
};

const SettingsTab = () => {
  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="tab-title">Platform Settings</h2>
      <div className="settings-grid">
        <GlassCard className="settings-card">
          <h3>General Settings</h3>
          <div className="form-group">
            <label>Platform Name</label>
            <input type="text" defaultValue="Solution Adda" className="premium-input" />
          </div>
          <div className="form-group">
            <label>Support Email</label>
            <input type="email" defaultValue="support@solutionadda.com" className="premium-input" />
          </div>
          <Button variant="primary">Save Changes</Button>
        </GlassCard>
        
        <GlassCard className="settings-card">
          <h3>Security</h3>
          <div className="form-group">
            <label>Two-Factor Authentication</label>
            <div className="toggle-switch active">
              <div className="toggle-knob"></div>
            </div>
          </div>
          <div className="form-group">
            <label>Require Email Verification</label>
            <div className="toggle-switch">
              <div className="toggle-knob"></div>
            </div>
          </div>
          <Button variant="danger" className="mt-4">Revoke All Sessions</Button>
        </GlassCard>
      </div>
    </motion.div>
  );
};

// --- Main Admin Component ---

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const users = JSON.parse(localStorage.getItem('sa_users') || '[]');
  const current = JSON.parse(localStorage.getItem('sa_user') || '{}');

  useEffect(() => {
    // Close sidebar on tab change on mobile
    setIsSidebarOpen(false);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('sa_user');
    navigate('/');
  };

  if (!current || current.role !== 'admin') {
    return (
      <div className="admin-page-denied">
        <GlassCard className="access-denied-card" glow>
          <h2>Access Denied</h2>
          <p>You do not have administrative privileges to view this area.</p>
          <Button variant="primary" onClick={() => navigate('/')}>Return to Home</Button>
        </GlassCard>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="admin-layout">
      {/* Background */}
      <div className="admin-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <h2>Solution Adda Admin</h2>
        <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
      </div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Console</h2>
          <span className="version-badge">v2.0</span>
        </div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">{current.name.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <strong>{current.name}</strong>
            <Badge variant="admin" size="xs">Administrator</Badge>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-left">
            <h3>{tabs.find(t => t.id === activeTab)?.label}</h3>
          </div>
          <div className="topbar-right">
            <button className="topbar-icon" onClick={() => navigate('/')}>🏠</button>
            <button className="topbar-icon">🔔<span className="notif-dot"></span></button>
          </div>
        </div>
        
        <div className="admin-content-scroll">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardTab key="dashboard" users={users} />}
            {activeTab === 'users' && <UsersTab key="users" users={users} />}
            {activeTab === 'courses' && <CoursesTab key="courses" />}
            {activeTab === 'analytics' && <AnalyticsTab key="analytics" />}
            {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
            {activeTab === 'settings' && <SettingsTab key="settings" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Admin;
