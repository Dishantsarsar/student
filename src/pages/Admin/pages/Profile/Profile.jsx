import React, { useState } from 'react';
import { Save, Upload, Shield, Bell } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import { adminProfile } from '../../data/profile.js';
import '../../styles/forms.css';
import '../../styles/buttons.css';
import '../../styles/cards.css';
import './Profile.css';
import CustomDialog from '../../../../components/CustomDialog/CustomDialog';

function Profile() {
  const [profile] = useState(adminProfile);
  const [dialogConfig, setDialogConfig] = useState({ isOpen: false });

  const handleSave = () => {
    setDialogConfig({
      isOpen: true,
      title: 'Profile Updated',
      message: 'Profile saved! (Mock — backend integration required)',
      type: 'success',
      confirmText: 'Done'
    });
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="admin-page-content">
      <SectionHeader title="Profile" subtitle="Manage your admin profile">
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          <Save size={15} /> Save Changes
        </button>
      </SectionHeader>

      <div className="profile-grid">
        {/* Personal Info */}
        <div className="admin-card">
          <h3 className="profile-section-title">Personal Information</h3>

          <div className="profile-avatar-row">
            <div className="profile-avatar">{initials}</div>
            <div>
              <h3 className="profile-name">{profile.name}</h3>
              <p className="profile-role">{profile.role} · {profile.department}</p>
              <button className="admin-btn admin-btn-secondary admin-btn-sm profile-avatar-btn">
                <Upload size={13} /> Change Avatar
              </button>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Full Name</label>
              <input className="admin-input" defaultValue={profile.name} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>
              <input className="admin-input" defaultValue={profile.email} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Phone</label>
              <input className="admin-input" defaultValue={profile.phone} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Location</label>
              <input className="admin-input" defaultValue={profile.location} />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Bio</label>
            <textarea className="admin-textarea" defaultValue={profile.bio} />
          </div>
        </div>

        {/* Security & Notifications */}
        <div className="profile-side-col">
          <div className="admin-card">
            <h3 className="profile-section-title profile-section-title--icon">
              <Shield size={16} /> Security
            </h3>
            <div className="admin-form-group">
              <label className="admin-form-label">Current Password</label>
              <input className="admin-input" type="password" placeholder="Enter current password" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">New Password</label>
              <input className="admin-input" type="password" placeholder="Enter new password" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Confirm New Password</label>
              <input className="admin-input" type="password" placeholder="Confirm new password" />
            </div>
            <div className="admin-form-group admin-form-group--inline">
              <label className="admin-toggle">
                <input type="checkbox" defaultChecked={profile.twoFactorEnabled} />
                <span className="admin-toggle-slider" />
              </label>
              <label className="admin-form-label">Two-Factor Authentication</label>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="profile-section-title profile-section-title--icon">
              <Bell size={16} /> Notifications
            </h3>
            <div className="admin-form-group admin-form-group--inline">
              <label className="admin-toggle">
                <input type="checkbox" defaultChecked={profile.emailNotifications} />
                <span className="admin-toggle-slider" />
              </label>
              <label className="admin-form-label">Email Notifications</label>
            </div>
            <div className="admin-form-group admin-form-group--inline">
              <label className="admin-toggle">
                <input type="checkbox" defaultChecked={profile.smsNotifications} />
                <span className="admin-toggle-slider" />
              </label>
              <label className="admin-form-label">SMS Notifications</label>
            </div>
            <div className="profile-info-box">
              <span style={{ color: 'var(--admin-text-tertiary)' }}>Last login: </span>
              <strong>
                {new Date(profile.lastLogin).toLocaleString('en-IN', {
                  dateStyle: 'medium', timeStyle: 'short',
                })}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <CustomDialog
        {...dialogConfig}
        onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default Profile;
