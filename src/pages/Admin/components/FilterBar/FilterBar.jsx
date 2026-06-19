import React from 'react';
import '../../styles/forms.css';

function FilterBar({ filters, values, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {filters.map((filter) => (
        <select
          key={filter.key}
          className="admin-select"
          value={values[filter.key] || ''}
          onChange={(e) => onChange(filter.key, e.target.value)}
          style={{ width: 'auto', minWidth: '140px' }}
        >
          {filter.options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

export default FilterBar;
