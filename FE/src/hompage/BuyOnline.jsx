import React, { useState } from 'react';
import { ShoppingBag, Star, Heart, ArrowRight, Check, Plus } from 'lucide-react';

const BuyOnline = () => {
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = {
    name: "DIY Minimalist Craft Kit",
    price: 299000,
    originalPrice: 399000,
    rating: 4.8,
    reviews: 324,
    colors: [
      { name: 'black', color: '#000000' },
      { name: 'white', color: '#FFFFFF' },
      { name: 'gray', color: '#9CA3AF' },
      { name: 'beige', color: '#F5F5DC' }
    ],
    images: [
      '/api/placeholder/400/500',
      '/api/placeholder/400/500',
      '/api/placeholder/400/500'
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.slice(1).map((img, index) => (
                <div key={index} className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <img 
                    src={img} 
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">

            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>
              
              <h1 className="text-3xl font-light text-gray-900">{product.name}</h1>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  -25%
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.name 
                        ? 'border-gray-900 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color.color }}
                  >
                    {color.name === 'white' && (
                      <div className="w-full h-full rounded-full border border-gray-100"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-4 h-0.5 bg-gray-600"></div>
                  </button>
                  <span className="px-4 py-2 font-medium text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">In stock</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <button className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-4 rounded-xl border transition-colors ${
                    isWishlisted 
                      ? 'border-red-200 bg-red-50 text-red-500' 
                      : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <button className="w-full bg-white border border-gray-900 text-gray-900 py-4 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                Buy Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Free shipping on orders over Rp 500.000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Sustainable materials</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Details</h3>
              <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                <p>This DIY kit includes all materials you need to create a beautiful handmade piece at home.</p>
                <p>Perfect for hobbyists, kids, and crafters. Made with eco-friendly materials.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyOnline;
