import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Truck, CheckCircle, Clock, CreditCard, 
  MapPin, Phone, Mail, Download, Copy, Calendar, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProductImage from '../components/ProductImage';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}order/${orderId}`,
          { headers: getAuthHeaders() }
        );
        
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, getAuthHeaders]);

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return 'Rp0';
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      paid: CreditCard,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: AlertTriangle,
      refunded: Package
    };
    const IconComponent = icons[status] || Clock;
    return <IconComponent size={20} />;
  };

  const handleCopyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const handleBackToOrders = () => {
    navigate('/my-orders');
  };

  const canCancelOrder = (order) => {
    return ['pending', 'paid'].includes(order.status);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}order/${orderId}/cancel`,
        { reason: cancelReason },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setOrder(response.data.data);
        setShowCancelModal(false);
        setCancelReason('');
        alert('Order cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="font-lato text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="font-lato text-2xl font-medium text-gray-900 mb-2">Order Not Found</h2>
          <p className="font-lato text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToOrders}
            className="px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={handleBackToOrders}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-lato"
          >
            <ArrowLeft size={20} />
            <span>Back to My Orders</span>
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex text-sm font-lato text-gray-500">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-black transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <button 
              onClick={handleBackToOrders}
              className="hover:text-black transition-colors"
            >
              My Orders
            </button>
            <span className="mx-2">/</span>
            <span className="text-black">Order #{order.orderNumber}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h1 className="font-cookie text-4xl font-light text-[#0a0205] mb-2">
              Order Details
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-lato text-lg font-medium">#{order.orderNumber}</span>
                <button
                  onClick={handleCopyOrderNumber}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copy order number"
                >
                  <Copy size={16} />
                </button>
                {copyStatus === 'copied' && (
                  <span className="text-green-600 text-sm font-lato">Copied!</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            {getStatusIcon(order.status)}
            <span className={`px-4 py-2 border rounded-full font-medium font-lato ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Cancel Reason Display */}
        {order.status === 'cancelled' && order.cancelReason && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-none">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-lato font-medium text-red-800 mb-1">Order Cancelled</h4>
                <p className="font-lato text-red-700">{order.cancelReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Order Information */}
          <div className="bg-gray-50 p-6 rounded-none">
            <h3 className="font-lato font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Order Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-lato text-sm text-gray-600">Order Date</p>
                <p className="font-lato text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="font-lato text-sm text-gray-600">Payment Method</p>
                <p className="font-lato text-gray-900 capitalize">
                  {order.paymentMethod.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="font-lato text-sm text-gray-600">Total Amount</p>
                <p className="font-lato text-xl font-bold text-gray-900">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-6 rounded-none">
            <h3 className="font-lato font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Shipping Address
            </h3>
            <div className="space-y-2">
              <p className="font-lato text-gray-900 font-medium">{order.shippingAddress.fullName}</p>
              <p className="font-lato text-gray-700">{order.shippingAddress.address}</p>
              <p className="font-lato text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              <p className="font-lato text-gray-700">{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="font-lato text-gray-700 flex items-center gap-2">
                  <Phone size={16} />
                  {order.shippingAddress.phone}
                </p>
              )}
              {order.shippingAddress.email && (
                <p className="font-lato text-gray-700 flex items-center gap-2">
                  <Mail size={16} />
                  {order.shippingAddress.email}
                </p>
              )}
            </div>
          </div>

          {/* Tracking Information */}
          <div className="bg-gray-50 p-6 rounded-none">
            <h3 className="font-lato font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={20} />
              Tracking Information
            </h3>
            {order.tracking?.trackingNumber ? (
              <div className="space-y-3">
                <div>
                  <p className="font-lato text-sm text-gray-600">Tracking Number</p>
                  <p className="font-lato text-gray-900 font-medium">{order.tracking.trackingNumber}</p>
                </div>
                <div>
                  <p className="font-lato text-sm text-gray-600">Courier</p>
                  <p className="font-lato text-gray-900">{order.tracking.courier}</p>
                </div>
                {order.tracking.estimatedDelivery && (
                  <div>
                    <p className="font-lato text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-lato text-gray-900">
                      {new Date(order.tracking.estimatedDelivery).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                )}
                <button className="w-full mt-4 px-4 py-2 border border-black text-black rounded-none hover:bg-black hover:text-white transition-colors font-lato">
                  Track Package
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-lato text-gray-600">
                  Tracking information will be available once your order ships.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-none">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-lato font-medium text-gray-900">Order Items</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <div key={index} className="p-6 flex items-center gap-4">
                <ProductImage item={item} size="w-20 h-20" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-lato font-medium text-gray-900 mb-1 truncate">{item.name}</h4>
                  <p className="font-lato text-sm text-gray-600">Quantity: {item.quantity}</p>
                  {item.customization && (
                    <p className="font-lato text-sm text-gray-600 truncate">
                      Customization: {item.customization}
                    </p>
                  )}
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="font-lato font-medium text-gray-900">
                    {formatPrice(item.price)}
                  </p>
                  <p className="font-lato text-sm text-gray-600">
                    Total: {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="max-w-sm ml-auto space-y-2">
              <div className="flex justify-between font-lato">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">
                  {formatPrice(order.subtotal || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between font-lato">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between font-lato">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-lato text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={handleBackToOrders}
            className="px-6 py-3 border border-black text-black rounded-none hover:bg-black hover:text-white transition-colors font-lato flex items-center gap-2 justify-center"
          >
            <ArrowLeft size={20} />
            Back to My Orders
          </button>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 border border-black text-black rounded-none hover:bg-black hover:text-white transition-colors font-lato flex items-center gap-2 justify-center">
              <Download size={20} />
              Download Invoice
            </button>
            
            {order.status === 'delivered' && (
              <button className="px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato">
                Leave a Review
              </button>
            )}
            
            {canCancelOrder(order) && (
              <button 
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-3 border border-red-600 text-red-600 rounded-none hover:bg-red-600 hover:text-white transition-colors font-lato"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCancelModal(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white max-w-md w-full rounded-none border border-gray-200 shadow-2xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="font-lato text-lg font-medium text-gray-900">
                    Cancel Order #{order.orderNumber}
                  </h3>
                </div>
                
                <p className="font-lato text-gray-600 mb-4">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                
                <div className="mb-4">
                  <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                    Reason for cancellation *
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please provide a reason for cancellation..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-lato"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancelling}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors font-lato"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={!cancelReason.trim() || cancelling}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-none hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-lato flex items-center justify-center gap-2"
                  >
                    {cancelling ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : null}
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;