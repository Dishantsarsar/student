import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, FolderTree, ClipboardList,
  Award, Star, Headphones, BarChart3, Settings, User,
  LogOut, ChevronLeft, ChevronRight, GraduationCap, X
} from 'lucide-react';
import '../../styles/sidebar.css';

/* ── Menu structure with sections and badges ── */
const menuSections = [
  {
    label: null,
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    ],
  },
  {
    label: 'ACADEMICS',
    items: [
      { label: 'Courses',     icon: BookOpen,       path: '/admin/courses' },
      { label: 'Categories',  icon: FolderTree,     path: '/admin/categories' },
      { label: 'Students',    icon: Users,           path: '/admin/students' },
      { label: 'Enrollments', icon: ClipboardList,  path: '/admin/enrollments', badge: 'New' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { label: 'Certificates', icon: Award, path: '/admin/certificates' },
      { label: 'Reviews',      icon: Star,  path: '/admin/reviews',  badge: 12 },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { label: 'Reports', icon: BarChart3, path: '/admin/reports' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Support',          icon: Headphones, path: '/admin/support',  badge: 4 },
      { label: 'Website Settings', icon: Settings,   path: '/admin/settings' },
      { label: 'Profile',          icon: User,        path: '/admin/profile' },
    ],
  },
];

/* ── Tooltip component ── */
function Tooltip({ label, children }) {
  return (
    <div className="sb-tooltip-wrapper">
      {children}
      <span className="sb-tooltip" role="tooltip">{label}</span>
    </div>
  );
}

/* ── Badge component ── */
function Badge({ value }) {
  if (!value || value === 0) return null;
  return <span className="sb-badge">{value}</span>;
}

/* ── Single menu item ── */
function MenuItem({ item, collapsed, onMobileClose }) {
  const Icon = item.icon;

  const content = (
    <NavLink
      to={item.path}
      end={item.path === '/admin'}
      className={({ isActive }) => `sb-item${isActive ? ' sb-item--active' : ''}`}
      onClick={onMobileClose}
      aria-label={item.label}
    >
      <span className="sb-item__icon">
        <Icon size={20} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="sb-item__label">{item.label}</span>
      <Badge value={item.badge} />
    </NavLink>
  );

  if (collapsed) {
    return <Tooltip label={item.label}>{content}</Tooltip>;
  }
  return content;
}

/* ── Main Sidebar ── */
function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  /* Close mobile sidebar on Escape key */
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && mobileOpen) onMobileClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen, onMobileClose]);

  const handleLogout = () => {
    localStorage.removeItem('sa_user');
    navigate('/');
  };

  return (
    <>
      {/* ── Mobile Overlay ── */}
      <div
        className={`sb-overlay${mobileOpen ? ' sb-overlay--visible' : ''}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* ── Sidebar Wrapper ── */}
      <aside
        ref={sidebarRef}
        className={`sb-root${collapsed ? ' sb-root--collapsed' : ''}${mobileOpen ? ' sb-root--open' : ''}`}
        aria-label="Admin navigation"
      >

        {/* ─── Logo Section ─── */}
        <div className="sb-logo">
          <div className="sb-logo__icon" aria-hidden="true">
            <GraduationCap size={22} strokeWidth={2} />
          </div>
          <div className="sb-logo__text">
            <span className="sb-logo__title">Solution Adda</span>
            <span className="sb-logo__sub">Student LMS Admin</span>
          </div>

          {/* Mobile close button */}
          <button
            className="sb-mobile-close"
            onClick={onMobileClose}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Navigation ─── */}
        <nav className="sb-nav" aria-label="Sidebar navigation">
          {menuSections.map((section, si) => (
            <div key={si} className="sb-section">
              {section.label && (
                <span className="sb-section__label" aria-hidden={collapsed}>
                  {section.label}
                </span>
              )}
              {section.items.map((item) => (
                <MenuItem
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                  onMobileClose={onMobileClose}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* ─── Profile Footer ─── */}
        <div className="sb-profile">
          <div className="sb-profile__avatar" aria-hidden="true">SA</div>
          <div className="sb-profile__info">
            <span className="sb-profile__name">Super Admin</span>
            <span className="sb-profile__email">admin@solutionadda.com</span>
          </div>
          <button
            className="sb-profile__logout"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>

        {/* ─── Collapse Toggle (desktop only) ─── */}
        <button
          className="sb-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
