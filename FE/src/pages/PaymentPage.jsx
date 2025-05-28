import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../components/payment/PaymentForm';
import PaymentSummary from '../components/payment/PaymentSummary';

const PaymentPage = () => {
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePaymentSuccess = () => {
    setProcessing(false);
    navigate('/order-confirmation');
  };

  const handlePaymentError = (error) => {
    setProcessing(false);
    console.error('Payment failed:', error);
    // Handle payment error
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PaymentForm
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            processing={processing}
            setProcessing={setProcessing}
          />
        </div>
        
        <div>
          <PaymentSummary />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;