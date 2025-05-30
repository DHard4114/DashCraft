import React, { useState } from 'react';
import { X, Star, Clock, Target, ShoppingCart, Heart, Package, Shield, Minus, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductDetailModal = ({ 
  product, 
  onClose, 
  onAddToCart, // Pass this from parent component
  onShowToast  // Pass this from parent component  
}) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rp${price.toLocaleString('id-ID')}`;
    }
    return 'Price unavailable';
  };

  // Simplified Add to Cart - Using parent's function
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      if (onShowToast) {
        onShowToast('Please login to add items to cart', 'error');
      }
      return;
    }

    if (product.stock === 0) {
      if (onShowToast) {
        onShowToast('Item is out of stock', 'error');
      }
      return;
    }

    setLoading(true);
    
    try {
      // Use parent's onAddToCart function with quantity
      if (onAddToCart) {
        await onAddToCart(product, quantity);
      } else {
        // Fallback: Direct API call if no parent function
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth/login');
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API}cart/add`,
          {
            itemId: product._id,
            quantity: quantity
          },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          if (onShowToast) {
            onShowToast('Item added to cart successfully!', 'success');
          }
          onClose(); // Close modal on success
        } else {
          throw new Error(response.data.error || 'Failed to add item to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      let errorMessage = 'Failed to add item to cart';
      
      if (error.response?.status === 401) {
        errorMessage = 'Please login again';
        navigate('/auth/login');
      } else if (error.response?.status === 404) {
        errorMessage = 'Item not found or no longer available';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.error || 'Item is not available';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      if (onShowToast) {
        onShowToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-none">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="font-cookie text-3xl font-light text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden bg-gray-100 rounded-none">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              
              {/* Additional Images - Mock */}
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`aspect-square bg-gray-100 rounded-none cursor-pointer border-2 ${
                      selectedImageIndex === index ? 'border-black' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              
              {/* Basic Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-black text-white text-xs px-2 py-1 rounded-none">
                    {product.tag}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-none">
                    {product.categoryName}
                  </span>
                </div>
                
                <h1 className="font-lato text-2xl font-medium text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                <p className="font-lato text-gray-600 leading-relaxed">
                  {product.description || 'Discover this amazing craft tutorial with step-by-step instructions and premium materials included.'}
                </p>
                
                <p className="font-lato text-sm text-gray-500 mt-2">
                  Created by {product.creatorName}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-lato text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.ratingCount} reviews)
                  </span>
                </div>
                <span className="font-lato text-sm text-gray-500">
                  {product.sold} sold
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-lato text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="font-lato text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-none">
                        -{product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                {product.freeShipping && (
                  <p className="font-lato text-sm text-green-600">
                    🚚 Free shipping on this item
                  </p>
                )}
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-lato text-sm font-medium text-gray-700">Difficulty</p>
                    <p className="font-lato text-sm text-gray-600">{product.difficulty || 'Medium'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-lato text-sm font-medium text-gray-700">Time Needed</p>
                    <p className="font-lato text-sm text-gray-600">{product.estimatedTime || '2-3 hours'}</p>
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div className="p-4 bg-gray-50 rounded-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-lato text-sm font-medium text-gray-700">Stock Available</p>
                    <p className="font-lato text-sm text-gray-600">
                      {product.stock > 10 ? (
                        <span className="text-green-600">In Stock ({product.stock} available)</span>
                      ) : product.stock > 0 ? (
                        <span className="text-orange-600">Low Stock ({product.stock} left)</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </p>
                  </div>
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-none">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 font-lato min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="font-lato text-sm text-gray-600">
                  Total: {formatPrice(product.price * quantity)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-lato"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                  {loading ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors"
                  title="Add to Wishlist"
                >
                  <Heart size={20} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-lato text-sm text-gray-600">30-day money back guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="font-lato text-sm text-gray-600">Premium materials included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
