import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
  };

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
        {currentUser && currentUser.role === 'teacher' && (
          <li><Link to="/teacher" onClick={() => setMenuOpen(false)}>Teacher Panel</Link></li>
        )}
        {currentUser && currentUser.role === 'user' && (
          <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>My Dashboard</Link></li>
        )}
        {currentUser && currentUser.role === 'admin' && (
          <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link></li>
        )}
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
      </ul>

      <div className="navbar-actions">
        {currentUser ? (
          <div className="user-nav-profile" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span className="user-name-badge" style={{ color: "#00f2fe", fontWeight: 600, fontSize: "0.9rem" }}>👋 {currentUser.name}</span>
            <button className="btn-login logout-btn" onClick={handleLogout} style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>Log Out</button>
          </div>
        ) : (
            <button className="btn-signup" onClick={() => navigate('/auth', { state: { isLogin: true } })}>Sign In</button>
        )}
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>
    </nav>
  );
}

export default Navbar;
