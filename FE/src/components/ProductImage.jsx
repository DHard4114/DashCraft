import React, { useState } from 'react';
import { Package } from 'lucide-react';

const ProductImage = ({ item, size = 'w-20 h-20' }) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (item) => {
    // Try different possible image sources based on backend structure
    
    // 1. Direct item.images array (from Item model)
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      const primaryImage = item.images.find(img => img.isPrimary);
      if (primaryImage && primaryImage.url) {
        return primaryImage.url;
      }
      // Fallback to first image
      if (item.images[0] && item.images[0].url) {
        return item.images[0].url;
      }
      // If images array contains string URLs
      if (typeof item.images[0] === 'string') {
        return item.images[0];
      }
    }
    
    // 2. Single image property
    if (item.image && typeof item.image === 'string') {
      return item.image;
    }
    
    // 3. For populated item references (item.item.images)
    if (item.item && item.item.images && Array.isArray(item.item.images) && item.item.images.length > 0) {
      const primaryImage = item.item.images.find(img => img.isPrimary);
      if (primaryImage && primaryImage.url) {
        return primaryImage.url;
      }
      if (item.item.images[0] && item.item.images[0].url) {
        return item.item.images[0].url;
      }
      if (typeof item.item.images[0] === 'string') {
        return item.item.images[0];
      }
    }
    
    // 4. Legacy single image on item reference
    if (item.item && item.item.image) {
      return item.item.image;
    }
    
    return null;
  };

  const imageUrl = getImageUrl(item);

  if (!imageUrl || imageError) {
    return (
      <div className={`${size} bg-gray-100 border border-gray-200 rounded-none flex items-center justify-center flex-shrink-0`}>
        <Package size={size.includes('8') ? 16 : 24} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`${size} flex-shrink-0`}>
      <img
        src={imageUrl}
        alt={item.name || item.item?.name || 'Product'}
        className="w-full h-full object-cover rounded-none border border-gray-200"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage;