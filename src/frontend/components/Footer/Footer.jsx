import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Solution Adda</h3>
          <p>Empowering the next generation of tech leaders.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/auth">Sign-in/Sign-up</Link></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <span role="img" aria-label="twitter">🐦</span>
            <span role="img" aria-label="facebook">📘</span>
            <span role="img" aria-label="instagram">📸</span>
            <span role="img" aria-label="linkedin">💼</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Solution Adda. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
