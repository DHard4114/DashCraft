import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { getCart } from '../services/cartService';
import PaymentModal from '../components/PaymentModal';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await getCart();
      setCartItems(response.data.items);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                key={item.item._id}
                item={item}
                onUpdate={loadCart}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg">
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-4 text-blue-500 hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        <div>
          <CartSummary
            items={cartItems}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          subtotal={cartItems.reduce((sum, item) => 
            sum + (item.priceAtAddition * item.quantity), 0
          )}
        />
      )}
    </div>
  );
};

export default Cart;