import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function SettingsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '600px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>Manage your profile and preferences.</p>
      </div>
      <GlassCard>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Full Name" defaultValue="Student User" />
          <Input label="Email" type="email" defaultValue="student@solutionadda.com" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <Button>Save Changes</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

export default SettingsView;
