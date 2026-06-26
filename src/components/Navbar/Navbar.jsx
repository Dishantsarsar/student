import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* Detect logged-in user from localStorage */
  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('sa_user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  /* Scroll detection for glass intensity */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('sa_user');
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  const baseNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/about', label: 'About' },
  ];

  const navLinks = user && user.role === 'admin' 
    ? [...baseNavLinks, { path: '/admin', label: 'Dashboard' }] 
    : baseNavLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
        <span className="logo-icon">🎓</span>
        <span className="logo-text">Solution Adda</span>
      </Link>

      {/* Desktop Nav Links */}
      <ul className="navbar-links">
        {navLinks.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
              {isActive(link.path) && (
                <motion.div
                  className="nav-active-indicator"
                  layoutId="navIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right Actions */}
      <div className="navbar-actions">
        {user ? (
          <div className="profile-menu-wrapper">
            <button
              className="profile-trigger"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User menu"
            >
              <div className="profile-avatar">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="profile-name">{user.name?.split(' ')[0]}</span>
              <svg className={`profile-chevron ${profileOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className="profile-dropdown"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                    <div>
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                      Dashboard
                    </Link>
                  )}
                  <button className="dropdown-item dropdown-danger" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <button className="btn-login" onClick={() => navigate('/auth', { state: { isLogin: true } })}>
              Sign In
            </button>
            <button className="btn-signup" onClick={() => navigate('/auth', { state: { isLogin: false } })}>
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className={`hamburger ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <div className="mobile-menu-inner">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="mobile-actions">
                  <button className="btn-login" onClick={() => { navigate('/auth', { state: { isLogin: true } }); setMenuOpen(false); }}>
                    Sign In
                  </button>
                  <button className="btn-signup" onClick={() => { navigate('/auth', { state: { isLogin: false } }); setMenuOpen(false); }}>
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="mobile-user-info">
                  <div className="mobile-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                  <span>{user.name}</span>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  )}
                  <button className="mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
