import React from 'react';

function SectionHeader({ title, subtitle, children }) {
  return (
    <div className="section-header">
      <div>
        <h1 className="section-header-title">{title}</h1>
        {subtitle && (
          <p className="section-header-subtitle">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="section-header-actions">
          {children}
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
