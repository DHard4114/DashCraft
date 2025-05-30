import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CreditCard, Truck, CheckCircle, ShoppingBag, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProductImage from '../components/ProductImage';

const MyOrders = () => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}order/my-orders`,
          { headers: getAuthHeaders() }
        );
        
        if (response.data.success) {
          setOrders(response.data.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getAuthHeaders]);

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
      cancelled: X,
      refunded: Package
    };
    const IconComponent = icons[status] || Clock;
    return <IconComponent size={16} />;
  };

  const canCancelOrder = (order) => {
    return ['pending', 'paid'].includes(order.status);
  };

  const handleCancelOrder = async () => {
    if (!cancellingOrder || !cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}order/${cancellingOrder}/cancel`,
        { reason: cancelReason },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Update the order in state
        setOrders(orders.map(order => 
          order._id === cancellingOrder 
            ? { ...order, status: 'cancelled', cancelReason }
            : order
        ));
        
        setShowCancelModal(false);
        setCancellingOrder(null);
        setCancelReason('');
        alert('Order cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.response?.data?.error || 'Failed to cancel order');
    }
  };

  const openCancelModal = (orderId) => {
    setCancellingOrder(orderId);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancellingOrder(null);
    setCancelReason('');
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="font-lato text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="font-lato text-2xl font-medium text-gray-900 mb-2">Failed to Load Orders</h2>
          <p className="font-lato text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-cookie text-4xl font-light text-[#0a0205] mb-2">
            My Orders
          </h1>
          <p className="font-lato text-gray-600">
            Track and manage your orders
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'paid', label: 'Paid' },
              { key: 'processing', label: 'Processing' },
              { key: 'shipped', label: 'Shipped' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 border rounded-none transition-colors font-lato text-sm ${
                  filter === tab.key
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-lato text-xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="font-lato text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `You don't have any ${filter} orders.`
              }
            </p>
            <button
              onClick={() => navigate('/buy-online')}
              className="px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-none p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div>
                        <h3 className="font-lato font-medium text-lg">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="font-lato text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 border rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Items Preview with Images */}
                    <div className="mb-4">
                      <p className="font-lato text-sm text-gray-600 mb-3">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}:
                      </p>
                      
                      {/* Show first 3 items with images */}
                      <div className="flex flex-wrap gap-3 mb-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-none max-w-xs">
                            <ProductImage item={item} size="w-10 h-10" />
                            <span className="text-xs font-lato truncate">
                              {item.name} (x{item.quantity})
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center bg-gray-200 px-3 py-2 rounded-none text-xs font-lato">
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.tracking?.trackingNumber && (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-none">
                        <p className="font-lato text-sm text-blue-800">
                          <span className="font-medium">Tracking:</span> {order.tracking.trackingNumber} ({order.tracking.courier})
                        </p>
                      </div>
                    )}

                    {/* Cancel Reason */}
                    {order.status === 'cancelled' && order.cancelReason && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-none">
                        <p className="font-lato text-sm text-red-800">
                          <span className="font-medium">Cancelled:</span> {order.cancelReason}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors font-lato text-sm"
                      >
                        View Details
                      </button>
                      
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => openCancelModal(order._id)}
                          className="px-4 py-2 border border-red-600 text-red-600 rounded-none hover:bg-red-50 transition-colors font-lato text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                      
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato text-sm">
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="text-right">
                    <p className="font-lato text-2xl font-bold text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <p className="font-lato text-sm text-gray-600 capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeCancelModal}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white max-w-md w-full rounded-none border border-gray-200 shadow-2xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="font-lato text-lg font-medium text-gray-900">
                    Cancel Order
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
                    placeholder="Please provide a reason..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-lato"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={closeCancelModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors font-lato"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={!cancelReason.trim()}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-none hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-lato"
                  >
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

export default MyOrders;