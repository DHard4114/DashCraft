import React from 'react';
import { useNavigate } from 'react-router-dom';

const DisplayCardProduct = ({ product, onViewDetails }) => {
    const navigate = useNavigate();
    const imageUrl = product.imageUrl;
    
    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(product);
        } else {
            // Fallback navigation if no onViewDetails prop
            navigate(`/tutorial/${product.slug}`);
        }
    };

    const handleImageClick = () => {
        navigate(`/tutorial/${product.slug}`);
    };
    
    return (
        <div className="flex-shrink-0 w-[225px] bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="relative overflow-hidden cursor-pointer" onClick={handleImageClick}>
                <img
                    src={imageUrl}
                    alt={product.name || 'Product'}
                    className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Fixed height content area with better spacing */}
            <div className="p-4 font-mono h-[130px] flex flex-col">
                <div className="flex-1">
                    <h3 
                        className="text-sm font-light tracking-wide cursor-pointer hover:text-blue-600 transition-colors mb-2 text-ellipsis-2-lines"
                        onClick={handleImageClick}
                        title={product.name || 'Unnamed Product'} // Shows full name on hover
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '1.3',
                            maxHeight: '1 em'
                        }}
                    >
                        {product.name || 'Unnamed Product'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {typeof product.price === 'number'
                            ? `Rp${product.price.toLocaleString('id-ID')}`
                            : product.price || 'Price unavailable'}
                    </p>
                </div>
                
                {/* Button always at bottom */}
                <div className="mt-3">
                    <button 
                        onClick={handleViewDetails}
                        className="text-xs px-4 py-2 border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50 transition-colors duration-300 w-full"
                    >
                        View Tutorial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisplayCardProduct;