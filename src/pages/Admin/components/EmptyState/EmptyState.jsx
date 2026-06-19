import React from 'react';
import { Inbox } from 'lucide-react';

function EmptyState({ icon: Icon = Inbox, title = 'No data found', description = 'Try adjusting your search or filters.', action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--admin-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        color: 'var(--admin-text-muted)',
      }}>
        <Icon size={28} />
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--admin-text-primary)',
        marginBottom: '8px',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: 'var(--admin-text-tertiary)',
        maxWidth: '360px',
        marginBottom: action ? '20px' : 0,
      }}>
        {description}
      </p>
      {action && action}
    </div>
  );
}

export default EmptyState;
