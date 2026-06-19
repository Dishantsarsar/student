import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

function GlobalSearch({ searchQuery, setSearchQuery }) {
  const inputRef = useRef(null);

  // Keyboard shortcut ⌘K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="navbar-search">
      <Search size={18} className="navbar-search-icon" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search students, courses, certificates, tickets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Global search"
      />
      <span className="navbar-search-shortcut">⌘K</span>
    </div>
  );
}

export default GlobalSearch;
