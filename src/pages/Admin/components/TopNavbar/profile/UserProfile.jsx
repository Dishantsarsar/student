import React, { useState, useRef, useEffect, useCallback } from 'react';
import UserChip from './UserChip.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';
import './profile.css';

function UserProfile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);
  const toggleDropdown = useCallback(() => setDropdownOpen(prev => !prev), []);

  // Handle clicks outside and Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    }
    
    function handleEscape(event) {
      if (event.key === 'Escape' && dropdownOpen) {
        closeDropdown();
        // Return focus to trigger (optional, good for a11y)
        dropdownRef.current?.querySelector('.premium-user-chip')?.focus();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen, closeDropdown]);

  return (
    <div className={`navbar-profile ${dropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
      <UserChip onClick={toggleDropdown} isOpen={dropdownOpen} />
      <ProfileDropdown isOpen={dropdownOpen} onClose={closeDropdown} />
    </div>
  );
}

export default React.memo(UserProfile);
