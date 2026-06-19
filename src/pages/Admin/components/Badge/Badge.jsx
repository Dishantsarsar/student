import React from 'react';
import '../../styles/buttons.css';

function Badge({ variant = 'default', children, dot = false }) {
  const variants = {
    active: { bg: 'var(--admin-success-bg)', color: 'var(--admin-success)', dotColor: 'var(--admin-success)' },
    inactive: { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--admin-text-tertiary)', dotColor: 'var(--admin-text-tertiary)' },
    suspended: { bg: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', dotColor: 'var(--admin-danger)' },
    pending: { bg: 'var(--admin-warning-bg)', color: 'var(--admin-warning)', dotColor: 'var(--admin-warning)' },
    completed: { bg: 'var(--admin-success-bg)', color: 'var(--admin-success)', dotColor: 'var(--admin-success)' },
    published: { bg: 'var(--admin-success-bg)', color: 'var(--admin-success)', dotColor: 'var(--admin-success)' },
    draft: { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--admin-text-tertiary)', dotColor: 'var(--admin-text-tertiary)' },
    review: { bg: 'var(--admin-info-bg)', color: 'var(--admin-info)', dotColor: 'var(--admin-info)' },
    approved: { bg: 'var(--admin-success-bg)', color: 'var(--admin-success)', dotColor: 'var(--admin-success)' },
    hidden: { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--admin-text-tertiary)', dotColor: 'var(--admin-text-tertiary)' },
    open: { bg: 'var(--admin-warning-bg)', color: 'var(--admin-warning)', dotColor: 'var(--admin-warning)' },
    'in-progress': { bg: 'var(--admin-info-bg)', color: 'var(--admin-info)', dotColor: 'var(--admin-info)' },
    resolved: { bg: 'var(--admin-success-bg)', color: 'var(--admin-success)', dotColor: 'var(--admin-success)' },
    issued: { bg: 'var(--admin-success-bg)', color: 'var(--admin-success)', dotColor: 'var(--admin-success)' },
    generating: { bg: 'var(--admin-info-bg)', color: 'var(--admin-info)', dotColor: 'var(--admin-info)' },
    revoked: { bg: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', dotColor: 'var(--admin-danger)' },
    dropped: { bg: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', dotColor: 'var(--admin-danger)' },
    urgent: { bg: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', dotColor: 'var(--admin-danger)' },
    high: { bg: 'var(--admin-warning-bg)', color: 'var(--admin-warning)', dotColor: 'var(--admin-warning)' },
    medium: { bg: 'var(--admin-info-bg)', color: 'var(--admin-info)', dotColor: 'var(--admin-info)' },
    low: { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--admin-text-tertiary)', dotColor: 'var(--admin-text-tertiary)' },
    default: { bg: 'rgba(255,255,255,0.06)', color: 'var(--admin-text-secondary)', dotColor: 'var(--admin-text-secondary)' },
  };

  const style = variants[variant] || variants.default;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: 500,
      background: style.bg,
      color: style.color,
      whiteSpace: 'nowrap',
      lineHeight: 1.4,
    }}>
      {dot && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: style.dotColor,
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}

export default Badge;
