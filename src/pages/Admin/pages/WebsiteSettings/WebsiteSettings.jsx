import React, { useState } from 'react';
import { Save, Upload, Globe, Mail, Phone, MapPin, Link } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import { websiteSettings } from '../../data/settings.js';
import '../../styles/forms.css';
import '../../styles/buttons.css';
import '../../styles/cards.css';
import './WebsiteSettings.css';
import CustomDialog from '../../../../components/CustomDialog/CustomDialog';

function WebsiteSettings() {
  const [settings] = useState(websiteSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [dialogConfig, setDialogConfig] = useState({ isOpen: false });

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'social', label: 'Social Links' },
    { id: 'footer', label: 'Footer' },
    { id: 'hero', label: 'Hero Banner' },
    { id: 'seo', label: 'SEO' },
    { id: 'theme', label: 'Theme' },
  ];

  const handleSave = () => {
    setDialogConfig({
      isOpen: true,
      title: 'Settings Saved',
      message: 'Settings saved! (Mock — backend integration required)',
      type: 'success',
      confirmText: 'Done'
    });
  };

  return (
    <div className="admin-page-content">
      <SectionHeader title="Website Settings" subtitle="Configure your platform settings">
        <button className="admin-btn admin-btn-primary" onClick={handleSave}><Save size={15} /> Save Changes</button>
      </SectionHeader>

      {/* Tabs */}
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-btn ${activeTab === tab.id ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-card settings-card">
        {/* General */}
        {activeTab === 'general' && (
          <div>
            <h3 className="settings-section-title">General Settings</h3>
            <div className="admin-form-group"><label className="admin-form-label">Site Name</label><input className="admin-input" defaultValue={settings.general.siteName} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Tagline</label><input className="admin-input" defaultValue={settings.general.tagline} /></div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Logo</label>
                <div className="admin-file-upload"><Upload size={24} className="admin-file-upload-icon" /><div className="admin-file-upload-text"><span>Click to upload</span> or drag and drop</div></div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Favicon</label>
                <div className="admin-file-upload"><Upload size={24} className="admin-file-upload-icon" /><div className="admin-file-upload-text"><span>Click to upload</span> or drag and drop</div></div>
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        {activeTab === 'contact' && (
          <div>
            <h3 className="settings-section-title">Contact Information</h3>
            <div className="admin-form-row">
              <div className="admin-form-group"><label className="admin-form-label"><Mail size={14} className="settings-label-icon" />Email</label><input className="admin-input" defaultValue={settings.contact.email} /></div>
              <div className="admin-form-group"><label className="admin-form-label"><Phone size={14} className="settings-label-icon" />Phone</label><input className="admin-input" defaultValue={settings.contact.phone} /></div>
            </div>
            <div className="admin-form-group"><label className="admin-form-label"><MapPin size={14} className="settings-label-icon" />Address</label><textarea className="admin-textarea settings-textarea-sm" defaultValue={settings.contact.address} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Support Email</label><input className="admin-input" defaultValue={settings.contact.supportEmail} /></div>
          </div>
        )}

        {/* Social */}
        {activeTab === 'social' && (
          <div>
            <h3 className="settings-section-title">Social Media Links</h3>
            {[
              { key: 'facebook', icon: Link, label: 'Facebook' },
              { key: 'twitter', icon: Link, label: 'Twitter / X' },
              { key: 'instagram', icon: Link, label: 'Instagram' },
              { key: 'linkedin', icon: Link, label: 'LinkedIn' },
              { key: 'youtube', icon: Link, label: 'YouTube' },
              { key: 'github', icon: Link, label: 'GitHub' },
            ].map(({ key, icon: Icon, label }) => (
              <div className="admin-form-group" key={key}>
                <label className="admin-form-label"><Icon size={14} className="settings-label-icon" />{label}</label>
                <input className="admin-input" defaultValue={settings.social[key]} placeholder={`https://${key}.com/...`} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {activeTab === 'footer' && (
          <div>
            <h3 className="settings-section-title">Footer Settings</h3>
            <div className="admin-form-group"><label className="admin-form-label">Copyright Text</label><input className="admin-input" defaultValue={settings.footer.copyrightText} /></div>
            <div className="admin-form-row">
              <div className="admin-form-group admin-form-group--inline">
                <label className="admin-toggle"><input type="checkbox" defaultChecked={settings.footer.showSocialLinks} /><span className="admin-toggle-slider" /></label>
                <label className="admin-form-label">Show Social Links</label>
              </div>
              <div className="admin-form-group admin-form-group--inline">
                <label className="admin-toggle"><input type="checkbox" defaultChecked={settings.footer.showNewsletter} /><span className="admin-toggle-slider" /></label>
                <label className="admin-form-label">Show Newsletter</label>
              </div>
            </div>
          </div>
        )}

        {/* Hero */}
        {activeTab === 'hero' && (
          <div>
            <h3 className="settings-section-title">Hero Banner</h3>
            <div className="admin-form-group"><label className="admin-form-label">Title</label><input className="admin-input" defaultValue={settings.hero.title} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Subtitle</label><textarea className="admin-textarea settings-textarea-sm" defaultValue={settings.hero.subtitle} /></div>
            <div className="admin-form-row">
              <div className="admin-form-group"><label className="admin-form-label">CTA Text</label><input className="admin-input" defaultValue={settings.hero.ctaText} /></div>
              <div className="admin-form-group"><label className="admin-form-label">CTA Link</label><input className="admin-input" defaultValue={settings.hero.ctaLink} /></div>
            </div>
            <div className="admin-form-group"><label className="admin-form-label">Background Image</label><div className="admin-file-upload"><Upload size={24} className="admin-file-upload-icon" /><div className="admin-file-upload-text"><span>Click to upload</span> hero background image</div></div></div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div>
            <h3 className="settings-section-title settings-section-title--icon"><Globe size={16} />SEO Settings</h3>
            <div className="admin-form-group"><label className="admin-form-label">Meta Title</label><input className="admin-input" defaultValue={settings.seo.metaTitle} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Meta Description</label><textarea className="admin-textarea settings-textarea-sm" defaultValue={settings.seo.metaDescription} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Meta Keywords</label><input className="admin-input" defaultValue={settings.seo.metaKeywords} /></div>
            <div className="admin-form-row">
              <div className="admin-form-group"><label className="admin-form-label">Google Analytics ID</label><input className="admin-input" defaultValue={settings.seo.googleAnalyticsId} /></div>
              <div className="admin-form-group admin-form-group--inline">
                <label className="admin-toggle"><input type="checkbox" defaultChecked={settings.seo.sitemapEnabled} /><span className="admin-toggle-slider" /></label>
                <label className="admin-form-label">Enable Sitemap</label>
              </div>
            </div>
          </div>
        )}

        {/* Theme */}
        {activeTab === 'theme' && (
          <div>
            <h3 className="settings-section-title">Theme Settings</h3>
            <div className="admin-form-row">
              <div className="admin-form-group"><label className="admin-form-label">Mode</label>
                <select className="admin-select" defaultValue={settings.theme.mode}><option value="dark">Dark</option><option value="light">Light</option></select>
              </div>
              <div className="admin-form-group"><label className="admin-form-label">Font Family</label>
                <select className="admin-select" defaultValue={settings.theme.fontFamily}><option value="Inter">Inter</option><option value="Roboto">Roboto</option><option value="Outfit">Outfit</option></select>
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group"><label className="admin-form-label">Border Radius</label>
                <select className="admin-select" defaultValue={settings.theme.borderRadius}><option value="rounded">Rounded</option><option value="sharp">Sharp</option><option value="pill">Pill</option></select>
              </div>
            </div>
            <div className="settings-toggles">
              <div className="admin-form-group admin-form-group--inline">
                <label className="admin-toggle"><input type="checkbox" defaultChecked={settings.theme.enableAnimations} /><span className="admin-toggle-slider" /></label>
                <label className="admin-form-label">Enable Animations</label>
              </div>
              <div className="admin-form-group admin-form-group--inline">
                <label className="admin-toggle"><input type="checkbox" defaultChecked={settings.theme.enableGlassmorphism} /><span className="admin-toggle-slider" /></label>
                <label className="admin-form-label">Enable Glassmorphism</label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CustomDialog
        {...dialogConfig}
        onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default WebsiteSettings;
