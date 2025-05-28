import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductDetailModal = ({ product, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    setLoading(true);
    try {
      // Add item to cart dengan format yang sesuai dengan cartModel
      const response = await axios.post(
        `${import.meta.env.VITE_API}cart/`,
        {
          item: product._id,
          quantity: 1,
          priceAtAddition: product.price // Added to match schema
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        alert('Item added to cart successfully!');
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Cart error:', error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-[#fefff9] rounded-sm max-w-4xl w-full max-h-[95vh] overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="bg-[#f4f4f4] p-6">
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute right-0 top-0 p-2 bg-white/80 rounded-sm"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-sm"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 bg-[#fefff9]">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-medium text-gray-900">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">DIY Craft Kit</p>
              </div>

              {/* Price */}
              <div className="bg-[#ffe7e7] p-4 rounded-sm">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#f1efdd] p-4 rounded-sm">
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#e2e1e2] p-4 rounded-sm">
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="text-gray-900 font-medium">{product.difficulty}</p>
                </div>
                <div className="bg-[#f7fae8] p-4 rounded-sm">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-gray-900 font-medium">{product.estimatedTime}</p>
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Materials Included</p>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span
                      key={index}
                      className="bg-[#f4f4f4] px-3 py-1 rounded-sm text-sm"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-sm hover:bg-gray-800 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {loading ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
