import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './CustomDialog.css';

function CustomDialog({ isOpen, onClose, title, message, onConfirm, confirmText, type = 'confirm' }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      if (modalRef.current) modalRef.current.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAlert = type === 'alert' || type === 'success';

  return ReactDOM.createPortal(
    <div className="custom-dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="custom-dialog-content" onClick={(e) => e.stopPropagation()} tabIndex="-1" ref={modalRef}>
        <div className={`custom-dialog-icon ${type}`}>
          {type === 'success' ? '✅' : type === 'confirm' ? '⚠️' : 'ℹ️'}
        </div>
        
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="custom-dialog-actions">
          {!isAlert && (
            <button className="dialog-btn dialog-cancel" onClick={onClose}>
              Cancel
            </button>
          )}
          <button 
            className={`dialog-btn dialog-${type}`} 
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            {confirmText || 'OK'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default React.memo(CustomDialog);
