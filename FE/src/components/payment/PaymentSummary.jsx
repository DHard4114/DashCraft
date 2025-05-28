import React from 'react';
import { ShieldCheck, CreditCard } from 'lucide-react';

const PaymentSummary = ({ subtotal, tax = 0, shipping = 0 }) => {
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(subtotal)}
          </span>
        </div>
        
        {tax > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(tax)}
            </span>
          </div>
        )}

        {shipping > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(shipping)}
            </span>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span>Secure payment processing</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-600" />
          <span>Multiple payment methods available</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;