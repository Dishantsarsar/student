import React from 'react';
import { Search } from 'lucide-react';
import '../../styles/forms.css';

function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="admin-search-wrapper">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="admin-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
