import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

const Select = forwardRef(({ label, error, icon, className = '', containerClassName = '', options = [], ...props }, ref) => {
  return (
    <div className={`premium-select-container ${containerClassName}`}>
      {label && <label className="premium-select-label">{label}</label>}
      <div className="premium-select-wrapper">
        {icon && <span className="premium-select-icon">{icon}</span>}
        <select
          ref={ref}
          className={`premium-select ${icon ? 'has-icon' : ''} ${error ? 'has-error' : ''} ${className}`}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="premium-select-focus-ring" />
        <span className="premium-select-chevron">
          <ChevronDown size={18} />
        </span>
      </div>
      {error && <span className="premium-select-error">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
