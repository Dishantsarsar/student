import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './Drawer.css';

/**
 * Right-side Drawer component
 * Props:
 *   isOpen    — boolean
 *   onClose   — () => void
 *   title     — string
 *   children  — ReactNode
 *   width     — CSS width string (default: '440px')
 */
function Drawer({ isOpen, onClose, title, children, width = '440px' }) {
  const drawerRef = useRef(null);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ESC key */
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  /* Focus trap: move focus into drawer when it opens */
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-overlay${isOpen ? ' drawer-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className={`drawer-panel${isOpen ? ' drawer-panel--open' : ''}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">{title}</h3>
          <button
            className="drawer-close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {children}
        </div>
      </aside>
    </>
  );
}

export default Drawer;
