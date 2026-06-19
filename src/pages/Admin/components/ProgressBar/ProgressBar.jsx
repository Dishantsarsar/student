import React from 'react';

function ProgressBar({ value = 0, color, height = 6, showLabel = false }) {
  const getColor = () => {
    if (color) return color;
    if (value >= 80) return 'var(--admin-success)';
    if (value >= 50) return 'var(--admin-info)';
    if (value >= 25) return 'var(--admin-warning)';
    return 'var(--admin-danger)';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
      <div style={{
        flex: 1,
        height: `${height}px`,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '9999px',
        overflow: 'hidden',
        minWidth: '60px',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: getColor(),
          borderRadius: '9999px',
          transition: 'width 0.6s ease-out',
        }} />
      </div>
      {showLabel && (
        <span style={{
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--admin-text-secondary)',
          minWidth: '36px',
          textAlign: 'right',
        }}>
          {value}%
        </span>
      )}
    </div>
  );
}

export default ProgressBar;
