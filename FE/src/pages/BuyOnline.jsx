import React, { useState } from 'react';
import { Star, Clock, Target, Sparkles } from 'lucide-react';
import ProductDetailModal from '../components/ProductDetailModal';

const BuyOnline = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: "DIY dummy Craft Kit",
      price: 299000,
      originalPrice: 399000,
      rating: 4.8,
      image: "/api/placeholder/400/500",
      tag: "Best Seller",
      description: "A complete DIY craft kit perfect for beginners who want to explore their creativity.",
      difficulty: "Beginner",
      estimatedTime: "2 hours",
      materials: ["Wood pieces", "Paint", "Brushes", "Instructions"]
    },
    {
      id: 2,
      name: "Handmade Candle Set",
      price: 199000,
      originalPrice: 249000,
      rating: 4.6,
      image: "/api/placeholder/400/500",
      tag: "New Arrival",
      description: "Create your own scented candles with this premium kit.",
      difficulty: "Intermediate",
      estimatedTime: "1.5 hours",
      materials: ["Premium Wax", "Cotton Wicks", "Essential Oils", "Glass Containers"]
    },
    {
      id: 3,
      name: "Origami Starter Pack",
      price: 149000,
      originalPrice: 199000,
      rating: 4.9,
      image: "/api/placeholder/400/500",
      tag: "Top Rated",
      description: "Learn the ancient Japanese art of paper folding with our starter pack.",
      difficulty: "Beginner",
      estimatedTime: "1 hour",
      materials: ["Premium Origami Paper", "Step-by-step Guide", "Folding Tools"]
    }
  ];


  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#fefff9] border border-[#e2e1e2] rounded-sm hover:border-[#ffe7e7] transition-all cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            {/* Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-t-sm"
              />
              {/* Discount */}
              <div className="absolute top-4 right-4 bg-[#ffe7e7] text-gray-700 text-xs px-2 py-0.5 rounded-sm">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </div>
              {/* Tag */}
              <div className="absolute top-4 left-4 bg-[#f7fae8] text-gray-700 text-xs px-2 py-0.5 rounded-sm border border-[#f1efdd]">
                {product.tag}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2 bg-[#fefff9]">
              <h2 className="text-lg font-medium text-gray-900">{product.name}</h2>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>

              {/* Price */}
              <div className="space-y-1 bg-[#f1efdd] p-2 rounded-sm">
                <p className="text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
                <p className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
              </div>

              {/* Info */}
              <div className="flex gap-4 text-sm text-gray-600 pt-2">
                <div className="flex items-center gap-1 bg-[#f7fae8] px-2 py-1 rounded-sm">
                  <Target className="w-4 h-4 text-gray-500" />
                  {product.difficulty}
                </div>
                <div className="flex items-center gap-1 bg-[#ffe7e7] px-2 py-1 rounded-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {product.estimatedTime}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default BuyOnline;

