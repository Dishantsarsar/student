import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './AuthActionModal.css';

function AuthActionModal({ isOpen, onClose, mode = 'active' }) {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleDismiss = useCallback(() => {
    if (mode === 'passive') {
      sessionStorage.setItem('passive_auth_dismissed', 'true');
    }
    onClose();
  }, [mode, onClose]);

  useEffect(() => {
    let originalOverflow = '';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    if (isOpen) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      // Focus trap setup
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      if (isOpen) {
        document.body.style.overflow = originalOverflow;
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleDismiss]);

  if (!isOpen) return null;

  const handleSignIn = () => {
    handleDismiss();
    navigate('/auth', { state: { isLogin: true } });
  };

  const handleSignUp = () => {
    handleDismiss();
    navigate('/auth', { state: { isLogin: false } });
  };

  return ReactDOM.createPortal(
    <div 
      className="auth-action-overlay" 
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-desc"
    >
      <div 
        className="auth-action-content" 
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
        ref={modalRef}
      >
        <button 
          className="auth-action-close" 
          onClick={handleDismiss} 
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="auth-action-header">
          <div className="auth-action-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#fc00ff" />
                </linearGradient>
              </defs>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h2 id="auth-modal-title">
            {mode === 'exitIntent' ? "Wait! Before You Go 👋" : "Join Solution Adda to Continue Learning"}
          </h2>
          <p id="auth-modal-desc">
            {mode === 'exitIntent' 
              ? "Create your free account to save your learning journey and unlock premium features."
              : "Sign in or create your free account to enroll in courses, save your progress, access lessons, complete projects, and earn certificates."
            }
          </p>
        </div>

        <div className="auth-action-buttons">
          <button className="auth-action-primary" onClick={handleSignIn}>
            Sign In
          </button>
          <button className="auth-action-secondary" onClick={handleSignUp}>
            Create Account
          </button>
        </div>

        <div className="auth-action-footer">
          <button className="auth-action-text" onClick={handleDismiss}>
            Continue Browsing
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default React.memo(AuthActionModal);
