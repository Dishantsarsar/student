import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
    padding: '20px',
  },
  content: {
    background: 'var(--admin-bg-secondary)',
    border: '1px solid var(--admin-border-light)',
    borderRadius: 'var(--admin-radius-xl)',
    boxShadow: 'var(--admin-shadow-xl)',
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid var(--admin-border)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--admin-text-primary)',
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid var(--admin-border)',
    background: 'transparent',
    color: 'var(--admin-text-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  body: {
    padding: '24px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px 24px',
    borderTop: '1px solid var(--admin-border)',
  },
};

function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const maxWidths = { sm: '440px', md: '560px', lg: '720px', xl: '900px' };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={modalStyles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            style={{ ...modalStyles.content, maxWidth: maxWidths[size] || maxWidths.md }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div style={modalStyles.header}>
              <h3 style={modalStyles.title}>{title}</h3>
              <button style={modalStyles.closeBtn} onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={modalStyles.body}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div style={modalStyles.footer}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
