import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CheckCircle } from 'lucide-react';

function PaymentSuccess({ isOpen, onClose, onContinue }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--space-4) 0' }}>
        <CheckCircle size={64} color="var(--color-success)" style={{ marginBottom: 'var(--space-4)' }} />
        <h2 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Payment Successful!</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          Thank you for enrolling. Your transaction was completed securely.
        </p>
        <Button fullWidth onClick={onContinue}>
          Go to Dashboard
        </Button>
      </div>
    </Modal>
  );
}

export default PaymentSuccess;
