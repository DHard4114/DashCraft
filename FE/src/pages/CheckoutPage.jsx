import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../components/payment/PaymentForm';
import PaymentSummary from '../components/payment/PaymentSummary';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Example cart data - replace with your actual cart data
  const subtotal = 1000000;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = 50000;

  const handlePaymentSuccess = () => {
    navigate('/order-confirmation');
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    // Handle payment error (show error message, etc.)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PaymentForm
            total={subtotal + tax + shipping}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
        
        <div>
          <PaymentSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;