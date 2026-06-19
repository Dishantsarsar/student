import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">Solution Adda</span>
        </Link>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
      </ul>

      <div className="navbar-actions">
        {localStorage.getItem('sa_user') ? (
          <>
            <div className="user-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#05030f', fontWeight: 'bold', fontSize: '18px', marginRight: '16px' }}>
              U
            </div>
            <button className="btn-login" onClick={() => { localStorage.removeItem('sa_user'); window.location.reload(); }}>Logout</button>
          </>
        ) : (
          <>
            <button className="btn-login" onClick={() => navigate('/auth', { state: { isLogin: true } })}>Sign In</button>
            <button className="btn-signup" onClick={() => navigate('/auth', { state: { isLogin: false } })}>Sign Up</button>
          </>
        )}
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>
    </nav>
  );
}

export default Navbar;
