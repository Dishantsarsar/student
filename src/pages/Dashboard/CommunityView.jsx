import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

function CommunityView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>Community</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>Connect with other learners.</p>
      </div>
      <GlassCard>
        <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-10)' }}>
          Community discussions and forums coming soon.
        </div>
      </GlassCard>
    </div>
  );
}

export default CommunityView;
