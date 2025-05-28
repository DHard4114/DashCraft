import React, { useState } from 'react';
import { processPayment } from '../../services/paymentService';

export default function PaymentForm({ total, onSuccess, onError }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'paypal', name: 'PayPal', logo: '/images/paypal.svg' },
    { id: 'visa', name: 'Visa', logo: '/images/visa.svg' },
    { id: 'mastercard', name: 'Mastercard', logo: '/images/mastercard.svg' },
    { id: 'ovo', name: 'OVO', logo: '/images/ovo.svg' },
    { id: 'gopay', name: 'GoPay', logo: '/images/gopay.svg' },
    { id: 'shopeepay', name: 'ShopeePay', logo: '/images/shopeepay.svg' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await processPayment({
        method: paymentMethod,
        amount: total
      });
      
      onSuccess(response.data);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer ${
              paymentMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <img
              src={method.logo}
              alt={method.name}
              className="h-8 object-contain mx-auto mb-2"
            />
            <p className="text-center text-sm font-medium">{method.name}</p>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={!paymentMethod || loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium 
          ${
            !paymentMethod || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}