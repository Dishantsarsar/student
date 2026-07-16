import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Chatbot from '../Chatbot/Chatbot';
import './DashboardLayout.css';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>
      
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="dashboard-main">
        <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default DashboardLayout;
