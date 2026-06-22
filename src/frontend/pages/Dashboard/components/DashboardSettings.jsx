import React, { useState } from 'react';
import '../DashboardStyles.css';
import './DashboardSettings.css';

function DashboardSettings({ currentUser }) {
  const [tab, setTab] = useState('profile');
  const [name, setName] = useState(currentUser?.name || '');
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    assignments: true,
    certificates: true,
    community: false,
    system: true,
    mentor: true,
    placement: false,
  });

  const handleSave = () => {
    const updatedUser = { ...currentUser, name };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = ['profile', 'notifications', 'privacy', 'sessions'];

  return (
    <div className="dash-section dash-settings">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">
            <span className="title-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>⚙️</span>
            Settings
          </h2>
          <p className="dash-section-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`settings-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'profile' && '👤'}
              {t === 'notifications' && '🔔'}
              {t === 'privacy' && '🔒'}
              {t === 'sessions' && '💻'}
              <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content dash-glass-card">
          {tab === 'profile' && (
            <div className="settings-panel">
              <h3 className="settings-panel-title">Profile Information</h3>

              <div className="settings-avatar-row">
                <div className="settings-big-avatar">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="settings-avatar-name">{currentUser?.name}</div>
                  <div className="settings-avatar-email">{currentUser?.email}</div>
                  <button className="dash-btn ghost" style={{ marginTop: 8, fontSize: '0.8rem' }}>
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="settings-form">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="settings-input"
                    placeholder="Your full name"
                  />
                </div>
                <div className="settings-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    readOnly
                    className="settings-input readonly"
                    placeholder="your@email.com"
                  />
                  <span className="settings-field-hint">Email cannot be changed</span>
                </div>
                <div className="settings-field">
                  <label>Role</label>
                  <input type="text" value="Student" readOnly className="settings-input readonly" />
                </div>
              </div>

              <div className="settings-form-actions">
                <button className="dash-btn primary" onClick={handleSave}>
                  {saved ? '✅ Saved!' : '💾 Save Changes'}
                </button>
              </div>

              <div className="settings-divider" />
              <h3 className="settings-panel-title">Change Password</h3>
              <div className="settings-form">
                <div className="settings-field">
                  <label>Current Password</label>
                  <input type="password" className="settings-input" placeholder="••••••••" />
                </div>
                <div className="settings-field">
                  <label>New Password</label>
                  <input type="password" className="settings-input" placeholder="••••••••" />
                </div>
              </div>
              <div className="settings-form-actions">
                <button className="dash-btn ghost">Update Password</button>
                <span className="coming-soon-badge">⏳ API Pending</span>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="settings-panel">
              <h3 className="settings-panel-title">Notification Preferences</h3>
              <div className="notif-list">
                {Object.entries(notifications).map(([key, val]) => (
                  <div key={key} className="notif-item">
                    <div className="notif-item-info">
                      <div className="notif-item-name">
                        {key === 'courseUpdates' && '📚 Course Updates'}
                        {key === 'assignments'   && '📝 Assignments'}
                        {key === 'certificates'  && '🎖️ Certificates'}
                        {key === 'community'     && '💬 Community'}
                        {key === 'system'        && '⚙️ System'}
                        {key === 'mentor'        && '👨‍🏫 Mentor Messages'}
                        {key === 'placement'     && '🚀 Placement Alerts'}
                      </div>
                      <div className="notif-item-desc">
                        {val ? 'Notifications enabled' : 'Notifications disabled'}
                      </div>
                    </div>
                    <button
                      className={`notif-toggle ${val ? 'on' : 'off'}`}
                      onClick={() => toggleNotif(key)}
                      aria-label={`Toggle ${key}`}
                    >
                      <div className="notif-toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="settings-panel">
              <h3 className="settings-panel-title">Privacy & Security</h3>
              <div className="privacy-items">
                {[
                  { icon: '🔒', title: 'Two-Factor Authentication', desc: 'Add an extra layer of security', action: 'Enable' },
                  { icon: '📊', title: 'Analytics Tracking', desc: 'Help us improve by sharing usage data', action: 'Opt Out' },
                  { icon: '🗑️', title: 'Delete Account', desc: 'Permanently delete your account and data', action: 'Delete', danger: true },
                ].map((item, i) => (
                  <div key={i} className="privacy-item">
                    <div className="privacy-item-icon">{item.icon}</div>
                    <div className="privacy-item-info">
                      <div className="privacy-item-title">{item.title}</div>
                      <div className="privacy-item-desc">{item.desc}</div>
                    </div>
                    <button className={`dash-btn ghost ${item.danger ? 'danger-btn' : ''}`}>
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <span className="coming-soon-badge">⏳ Backend Integration Pending</span>
              </div>
            </div>
          )}

          {tab === 'sessions' && (
            <div className="settings-panel">
              <h3 className="settings-panel-title">Active Sessions</h3>
              <div className="sessions-list">
                {[
                  { device: 'Chrome on Windows', location: 'Delhi, India', time: 'Now (Current)', icon: '💻', active: true },
                  { device: 'Safari on iPhone', location: 'Delhi, India', time: '2 hours ago', icon: '📱', active: false },
                ].map((session, i) => (
                  <div key={i} className="session-item">
                    <div className="session-icon">{session.icon}</div>
                    <div className="session-info">
                      <div className="session-device">{session.device} {session.active && <span className="dash-badge green" style={{ fontSize: '0.65rem' }}>● Current</span>}</div>
                      <div className="session-meta">{session.location} · {session.time}</div>
                    </div>
                    {!session.active && (
                      <button className="dash-btn ghost" style={{ fontSize: '0.78rem', padding: '7px 12px' }}>Revoke</button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <span className="coming-soon-badge">⏳ Backend Integration Pending</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardSettings;
