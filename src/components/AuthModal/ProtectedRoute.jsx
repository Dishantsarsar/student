import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthActionModal from './AuthActionModal';

function ProtectedRoute({ children }) {
  const [showModal, setShowModal] = useState(false);
  const isAuth = !!localStorage.getItem('sa_user');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      setShowModal(true);
    }
  }, [isAuth, location.pathname]);

  const handleClose = () => {
    setShowModal(false);
    navigate('/'); // Redirect to home if they refuse to login on a protected route
  };

  if (!isAuth) {
    return (
      <>
        {/* Render modal and an empty placeholder for the protected route */}
        <AuthActionModal isOpen={showModal} onClose={handleClose} mode="active" />
        <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          Authenticating...
        </div>
      </>
    );
  }

  return children;
}

export default ProtectedRoute;
