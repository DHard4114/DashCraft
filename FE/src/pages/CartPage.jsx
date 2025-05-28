import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch cart items
  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const updateQuantity = async (itemId, delta) => {
    try {
      await axios.put(`${import.meta.env.VITE_API}cart/items/${itemId}`, 
        { quantity: Math.max(1, cartItems.find(item => item.item._id === itemId).quantity + delta) },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}cart/items/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchCart(); // Refresh cart after removal
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handlePayment = async (paymentData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}payment/process`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data.success) {
        await axios.delete(`${import.meta.env.VITE_API}cart`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCartItems([]);
        alert('Payment successful!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
    }
    setShowPaymentModal(false);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  const subtotal = cartItems.reduce((sum, item) =>
    sum + (item.item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-medium mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-8">Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-8">Your cart is empty</div>
        ) : (
          <div className="bg-[#fefff9] rounded-sm border border-[#e2e1e2] overflow-hidden">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center p-4 border-b border-[#e2e1e2] last:border-b-0">
                <img
                  src={item.item.image}
                  alt={item.item.name}
                  className="w-24 h-24 object-cover rounded-sm"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-medium">{item.item.name}</h3>
                  <p className="text-gray-600">{formatPrice(item.priceAtAddition)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.item._id, -1)}
                    className="p-1 hover:bg-[#f1efdd] rounded-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.item._id, 1)}
                    className="p-1 hover:bg-[#f1efdd] rounded-sm"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeItem(item.item._id)}
                    className="ml-4 p-1 hover:bg-[#ffe7e7] rounded-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-[#fefff9] p-4 rounded-sm border border-[#e2e1e2]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-xl font-medium">
              {formatPrice(cartItems.reduce((total, item) => 
                total + (item.quantity * item.priceAtAddition), 0
              ))}
            </span>
          </div>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full bg-gray-900 text-white py-3 rounded-sm hover:bg-gray-800"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>

        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSubmit={handlePayment}
            subtotal={subtotal}
          />
        )}
      </div>
    </div>
  );
};

export default CartPage;
