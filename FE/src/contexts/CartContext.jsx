import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, getAuthHeaders } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  // Update cart count when items change
  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setCartLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}cart`,
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1, customization = '') => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}cart/add`,
        { itemId, quantity, customization },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        await fetchCart(); // Refresh cart
        return response.data;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!user) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}cart/update`,
        { itemId, quantity },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        await fetchCart(); // Refresh cart
        return response.data;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API}cart/remove/${itemId}`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        await fetchCart(); // Refresh cart
        return response.data;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API}cart/clear`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setCartItems([]);
        setCartCount(0);
        return response.data;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.item?.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const value = {
    cartItems,
    cartLoading,
    cartCount,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};