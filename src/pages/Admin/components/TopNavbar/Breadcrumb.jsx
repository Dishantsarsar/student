import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb({ currentPage }) {
  return (
    <nav className="navbar-breadcrumb">
      <Link to="/admin" className="navbar-breadcrumb-item">Dashboard</Link>
      {currentPage !== 'Dashboard' && (
        <>
          <span className="navbar-breadcrumb-sep">/</span>
          <span className="navbar-breadcrumb-item active">{currentPage}</span>
        </>
      )}
    </nav>
  );
}

export default Breadcrumb;
