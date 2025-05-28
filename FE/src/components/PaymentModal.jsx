import React, { useState } from 'react';
import { X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, subtotal, onSubmit }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'paypal', name: 'PayPal', logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
    { id: 'visa', name: 'Visa', logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" },
    { id: 'mastercard', name: 'Mastercard', logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" },
    { id: 'ovo', name: 'OVO', logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/640px-Logo_ovo_purple.svg.png" },
    { id: 'gopay', name: 'GoPay', logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Logo_Gopay.svg/640px-Logo_Gopay.svg.png" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMethod) return;

    setLoading(true);
    try {
      await onSubmit({ paymentMethod: selectedMethod });
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#fefff9] rounded-sm max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b border-[#e2e1e2]">
          <h2 className="text-xl font-medium">Select Payment Method</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f1efdd] rounded-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-sm cursor-pointer transition-all ${
                  selectedMethod === method.id ? 'border-gray-900 bg-[#f7fae8]' : 'border-[#e2e1e2]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="hidden"
                />
                <img src={method.logo} alt={method.name} className="h-8 w-auto mr-3" />
                <span className="font-medium">{method.name}</span>
              </label>
            ))}
          </div>

          <div className="border-t border-[#e2e1e2] pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total Payment</span>
              <span className="text-xl font-medium">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(subtotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={!selectedMethod || loading}
              className={`w-full bg-gray-900 text-white py-3 rounded-sm ${
                !selectedMethod || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
