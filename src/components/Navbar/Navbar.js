import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">Solution Adda</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/auth">Sign-in/Sign-up</Link></li>
      </ul>
      <div className="navbar-actions">
        <button className="btn-login">Log In</button>
        <button className="btn-signup">Sign Up</button>
      </div>
    </nav>
  );
}

export default Navbar;
