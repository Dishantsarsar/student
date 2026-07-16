import React from 'react';
import './EmptyState.css';

/* Beautiful empty state with icon, title, description, and optional CTA */
function EmptyState({ icon = '🔍', title = 'Nothing here yet', description = '', actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && (
        <button className="empty-state-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
