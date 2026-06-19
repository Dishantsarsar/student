import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar/TopNavbar.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/navbar.css';
import '../styles/cards.css';
import '../styles/table.css';
import '../styles/forms.css';
import '../styles/buttons.css';
import '../styles/responsive.css';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="admin-root">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className={`admin-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <TopNavbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
