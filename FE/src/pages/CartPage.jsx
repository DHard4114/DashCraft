import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft,
  Package,
  Truck,
  Shield,
  CreditCard,
  Clock,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PaymentModal from '../components/PaymentModal';
import Toast from '../components/Toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeaders } = useAuth(); // FIXED: Remove unused 'user'
  
  // State Management
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Shipping & Tax Calculations
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Fetch Cart Items
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}cart`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        const cartData = response.data.data;
        
        // Process cart items sesuai backend schema
        const processedItems = cartData.items?.map(cartItem => ({
          _id: `${cartItem.item._id}_${Date.now()}`, // Unique ID for cart item
          item: {
            _id: cartItem.item._id,
            name: cartItem.item.name,
            slug: cartItem.item.slug,
            price: cartItem.item.price,
            imageUrl: cartItem.item.images && cartItem.item.images.length > 0 
              ? cartItem.item.images.find(img => img.isPrimary)?.url || cartItem.item.images[0]?.url
              : '/placeholder-image.jpg',
            categoryName: cartItem.item.category?.name || 'Unknown Category',
            creatorName: cartItem.item.createdBy?.username || 'Unknown Creator',
            rating: cartItem.item.ratings?.average || 0,
            ratingCount: cartItem.item.ratings?.count || 0,
            status: cartItem.item.status
          },
          quantity: cartItem.quantity,
          price: cartItem.price, // Price when added to cart
          subtotal: cartItem.subtotal,
          // Mock additional data
          estimatedDelivery: getEstimatedDelivery(),
          stock: Math.floor(Math.random() * 50) + 5,
          freeShipping: cartItem.price > 100000
        })) || [];
        
        setCartItems(processedItems);
        
        // Select all items by default
        setSelectedItems(new Set(processedItems.map(item => item._id)));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setToast({ 
        show: true, 
        message: 'Failed to load cart items', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, getAuthHeaders]);

  // Get Estimated Delivery Date - FIXED: Remove unused parameter
  const getEstimatedDelivery = () => {
    const days = Math.floor(Math.random() * 5) + 2; // 2-7 days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Initial Load
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Update Quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Get actual item ID from cart item
    const cartItem = cartItems.find(item => item._id === cartItemId);
    if (!cartItem) return;
    
    const itemId = cartItem.item._id;
    
    setUpdating(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}cart/item/${itemId}`, 
        { quantity: newQuantity },
        {
          headers: getAuthHeaders()
        }
      );
      
      if (response.data.success) {
        // Update local state
        setCartItems(prev => prev.map(item => 
          item._id === cartItemId 
            ? { 
                ...item, 
                quantity: newQuantity, 
                subtotal: newQuantity * item.price 
              }
            : item
        ));
        
        setToast({ 
          show: true, 
          message: 'Quantity updated', 
          type: 'success' 
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setToast({ 
        show: true, 
        message: 'Failed to update quantity', 
        type: 'error' 
      });
    } finally {
      setUpdating(false);
    }
  };

  // Remove Item
  const removeItem = async (cartItemId) => {
    // Get actual item ID from cart item
    const cartItem = cartItems.find(item => item._id === cartItemId);
    if (!cartItem) return;
    
    const itemId = cartItem.item._id;
    
    setUpdating(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API}cart/item/${itemId}`, 
        {
          headers: getAuthHeaders()
        }
      );
      
      if (response.data.success) {
        // Update local state
        setCartItems(prev => prev.filter(item => item._id !== cartItemId));
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
        
        setToast({ 
          show: true, 
          message: 'Item removed from cart', 
          type: 'info' 
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setToast({ 
        show: true, 
        message: 'Failed to remove item', 
        type: 'error' 
      });
    } finally {
      setUpdating(false);
    }
  };

  // Toggle Item Selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Select All Items
  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item._id)));
    }
  };

  // Apply Promo Code
  const applyPromoCode = () => {
    // Mock promo code logic
    const validCodes = {
      'WELCOME10': 0.1,
      'CRAFT20': 0.2,
      'STUDENT15': 0.15
    };
    
    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()]);
      setToast({ 
        show: true, 
        message: `Promo code applied! ${(validCodes[promoCode.toUpperCase()] * 100)}% discount`, 
        type: 'success' 
      });
    } else {
      setToast({ 
        show: true, 
        message: 'Invalid promo code', 
        type: 'error' 
      });
    }
  };

  // Handle Payment - FIXED: Map state to province
  const handlePayment = async (paymentData) => {
    try {
      const selectedCartItems = cartItems.filter(item => selectedItems.has(item._id));
      
      // FIXED: Map frontend fields to backend schema
      const orderData = {
        items: selectedCartItems.map(item => ({
          itemId: item.item._id,
          quantity: item.quantity,
          priceAtOrder: item.price
        })),
        shippingMethod,
        promoCode: discount > 0 ? promoCode : null,
        paymentMethod: paymentData.method,
        // FIXED: Map state to province and zipCode to postalCode
        shippingAddress: {
          fullName: paymentData.address.fullName,
          phone: paymentData.address.phone,
          address: paymentData.address.address,
          city: paymentData.address.city,
          province: paymentData.address.state, // Map state to province
          postalCode: paymentData.address.zipCode, // Map zipCode to postalCode
          country: paymentData.address.country || 'Indonesia'
        },
        shippingCost: shippingCost,
        notes: paymentData.notes || ''
      };

      console.log('Order data being sent:', JSON.stringify(orderData, null, 2));

      const response = await axios.post(
        `${import.meta.env.VITE_API}order/create`,
        orderData,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.data.success) {
        // Remove purchased items from cart
        for (const item of selectedCartItems) {
          await removeItem(item._id);
        }
        
        setToast({ 
          show: true, 
          message: 'Order placed successfully!', 
          type: 'success' 
        });
        
        // Redirect to order confirmation
        setTimeout(() => {
          navigate(`/orders/${response.data.data._id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setToast({ 
        show: true, 
        message: error.response?.data?.error || 'Payment failed', 
        type: 'error' 
      });
    }
    setShowPaymentModal(false);
  };

  // Format Price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rp${price.toLocaleString('id-ID')}`;
    }
    return 'Rp0';
  };

  // Calculate Totals
  const selectedCartItems = cartItems.filter(item => selectedItems.has(item._id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.subtotal || item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'express' ? 25000 : (subtotal > 100000 ? 0 : 15000);
  const tax = subtotal * 0.11; // 11% PPN
  const discountAmount = subtotal * discount;
  const total = subtotal + shippingCost + tax - discountAmount;

  // Shipping Options
  const shippingOptions = [
    { 
      id: 'standard', 
      name: 'Standard Shipping', 
      price: subtotal > 100000 ? 0 : 15000, 
      time: '5-7 business days' 
    },
    { 
      id: 'express', 
      name: 'Express Shipping', 
      price: 25000, 
      time: '2-3 business days' 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="font-lato text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/buy-online')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="font-cookie text-4xl font-light text-[#0a0205]">
              Shopping Cart
            </h1>
            <p className="font-lato text-gray-600">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="font-lato text-2xl font-light text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="font-lato text-gray-500 mb-8">
              Discover amazing craft tutorials and kits to get started
            </p>
            <button
              onClick={() => navigate('/buy-online')}
              className="px-8 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Select All */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-none">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="font-lato text-sm font-medium">
                    Select All ({cartItems.length} items)
                  </span>
                </label>
                <span className="font-lato text-sm text-gray-600">
                  {selectedItems.size} of {cartItems.length} selected
                </span>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem._id}
                    className={`p-6 border rounded-none transition-all duration-200 ${
                      selectedItems.has(cartItem._id)
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex gap-4">
                      
                      {/* Selection Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(cartItem._id)}
                          onChange={() => toggleItemSelection(cartItem._id)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                      </div>

                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={cartItem.item.imageUrl}
                          alt={cartItem.item.name}
                          className="w-24 h-24 object-cover rounded-none border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-lato text-lg font-medium text-gray-900 line-clamp-2">
                              {cartItem.item.name}
                            </h3>
                            <p className="font-lato text-sm text-gray-600">
                              by {cartItem.item.creatorName} • {cartItem.item.categoryName}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(cartItem._id)}
                            disabled={updating}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 font-lato text-sm text-gray-600">
                              {cartItem.item.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="font-lato text-xs text-gray-400">
                            ({cartItem.item.ratingCount} reviews)
                          </span>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-lato text-lg font-bold text-gray-900">
                              {formatPrice(cartItem.price)}
                            </div>
                            <div className="font-lato text-sm text-gray-600">
                              Total: {formatPrice(cartItem.subtotal || cartItem.price * cartItem.quantity)}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-none">
                            <button
                              onClick={() => updateQuantity(cartItem._id, cartItem.quantity - 1)}
                              disabled={updating || cartItem.quantity <= 1}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 font-lato text-center min-w-[3rem] border-x border-gray-300">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(cartItem._id, cartItem.quantity + 1)}
                              disabled={updating || cartItem.quantity >= cartItem.stock}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {cartItem.quantity >= cartItem.stock && (
                          <div className="flex items-center gap-2 text-orange-600 text-sm">
                            <AlertCircle size={16} />
                            <span className="font-lato">Maximum stock reached</span>
                          </div>
                        )}

                        {/* Shipping Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {cartItem.freeShipping && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Truck size={16} />
                              <span className="font-lato">Free shipping</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span className="font-lato">Arrives by {cartItem.estimatedDelivery}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                
                {/* Promo Code */}
                <div className="p-6 border border-gray-200 rounded-none bg-white">
                  <h3 className="font-lato text-lg font-medium mb-4">Promo Code</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 border border-gray-300 rounded-none hover:bg-gray-50 transition-colors font-lato"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle size={16} />
                      <span className="font-lato">{(discount * 100)}% discount applied</span>
                    </div>
                  )}
                </div>

                {/* Shipping Options */}
                <div className="p-6 border border-gray-200 rounded-none bg-white">
                  <h3 className="font-lato text-lg font-medium mb-4">Shipping Options</h3>
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-none cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={shippingMethod === option.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                          />
                          <div>
                            <div className="font-lato font-medium">{option.name}</div>
                            <div className="font-lato text-sm text-gray-600">{option.time}</div>
                          </div>
                        </div>
                        <div className="font-lato font-medium">
                          {option.price === 0 ? 'FREE' : formatPrice(option.price)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="p-6 border border-gray-200 rounded-none bg-white">
                  <h3 className="font-lato text-lg font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 font-lato">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({selectedItems.size} items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (PPN 11%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({(discount * 100)}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={selectedItems.size === 0 || updating}
                    className="w-full mt-6 px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-lato flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </button>

                  {selectedItems.size === 0 && (
                    <p className="mt-2 text-sm text-gray-500 text-center font-lato">
                      Select items to proceed
                    </p>
                  )}
                </div>

                {/* Security Badges */}
                <div className="p-4 bg-gray-50 rounded-none">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Shield size={16} />
                      <span className="font-lato">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package size={16} />
                      <span className="font-lato">Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSubmit={handlePayment}
            orderSummary={{
              items: selectedCartItems,
              subtotal,
              shipping: shippingCost,
              tax,
              discount: discountAmount,
              total
            }}
          />
        )}

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: '' })}
          />
        )}
      </div>
    </div>
  );
};

export default CartPage;
