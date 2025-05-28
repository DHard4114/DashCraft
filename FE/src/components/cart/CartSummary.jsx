import React from 'react';

const CartSummary = ({ items, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => 
    sum + (item.priceAtAddition * item.quantity), 0
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(subtotal)}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className={`w-full py-2 px-4 rounded ${
          items.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;