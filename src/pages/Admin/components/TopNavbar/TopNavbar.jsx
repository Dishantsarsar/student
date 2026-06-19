import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import '../../styles/navbar.css';

import Breadcrumb from './Breadcrumb.jsx';
import GlobalSearch from './GlobalSearch.jsx';
import NotificationButton from './NotificationButton.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import UserProfile from './profile/UserProfile.jsx';

const breadcrumbMap = {
  '/admin': 'Dashboard',
  '/admin/students': 'Students',
  '/admin/courses': 'Courses',
  '/admin/categories': 'Categories',
  '/admin/enrollments': 'Enrollments',
  '/admin/certificates': 'Certificates',
  '/admin/reviews': 'Reviews',
  '/admin/support': 'Support',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Website Settings',
  '/admin/profile': 'Profile',
};

function TopNavbar({ onMobileMenuToggle }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = breadcrumbMap[location.pathname] || 'Dashboard';

  return (
    <header className="admin-navbar">
      <div className="navbar-container">
        {/* Left Column: Mobile Menu & Breadcrumb */}
        <div className="navbar-left">
          <button className="mobile-menu-toggle" onClick={onMobileMenuToggle} aria-label="Open mobile menu">
            <Menu size={24} />
          </button>
          
          <Breadcrumb currentPage={currentPage} />
        </div>

        {/* Center Column: Global Search */}
        <GlobalSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Right Column: Actions & Profile */}
        <div className="navbar-right">
          <NotificationButton hasUnread={true} onClick={() => console.log('Notifications clicked')} />
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  );
}

export default React.memo(TopNavbar);
