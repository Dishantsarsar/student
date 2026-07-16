import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Tabs, TabsContent, TabPane } from '../ui/Tabs';
import { CreditCard, Smartphone } from 'lucide-react';
import './Checkout.css';

function CheckoutModal({ isOpen, onClose, onSuccess, amount = 4999 }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('card');
  
  // Card form state
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');

  const formatCardNumber = (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNum(formatted);
  };

  const formatExpiry = (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setCardExp(val);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EduLearn Payment"
      description={`Amount to pay: ₹${amount.toLocaleString()}`}
    >
      <div className="checkout-container">
        <Tabs 
          tabs={[
            { id: 'card', label: 'Card', icon: <CreditCard size={16} /> },
            { id: 'upi', label: 'UPI', icon: <Smartphone size={16} /> }
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          className="checkout-tabs"
        />
        
        <form onSubmit={handlePayment} className="checkout-form">
          <TabsContent activeTab={activeTab}>
            <TabPane id="card">
              <div className="form-group-stack">
                <Input label="Cardholder Name" placeholder="Dishant Sarsar" required />
                <Input 
                  label="Card Number" 
                  placeholder="1234 5678 9101 1121" 
                  maxLength={19} 
                  value={cardNum} 
                  onChange={formatCardNumber}
                  required 
                />
                <div className="form-row">
                  <Input 
                    label="Expiry" 
                    placeholder="MM/YY" 
                    maxLength={5} 
                    value={cardExp}
                    onChange={formatExpiry}
                    required 
                  />
                  <Input 
                    label="CVV" 
                    type="password" 
                    placeholder="***" 
                    maxLength={3} 
                    required 
                  />
                </div>
              </div>
            </TabPane>
            
            <TabPane id="upi">
              <div className="form-group-stack">
                <Input label="Enter UPI ID" placeholder="dishant@apl" required={activeTab === 'upi'} />
                <div className="upi-help-text">Or scan QR code on next step</div>
              </div>
            </TabPane>
          </TabsContent>
          
          <Button 
            type="submit" 
            fullWidth 
            variant="primary" 
            disabled={isProcessing}
            style={{ marginTop: 'var(--space-6)' }}
          >
            {isProcessing ? 'Processing Payment...' : 'Pay Securely'}
          </Button>
        </form>
      </div>
    </Modal>
  );
}

export default CheckoutModal;
