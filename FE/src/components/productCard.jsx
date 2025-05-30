import React from 'react';
import { Star, Clock, BookOpen, Users, Eye } from 'lucide-react';

const ProductCard = ({ product, viewMode = 'grid', onViewTutorial }) => {
    // Get primary image or first image
    const imageUrl = product.imageUrl || '/placeholder-image.jpg';
    
    // Format price
    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) return 'Rp0';
        return `Rp${price.toLocaleString('id-ID')}`;
    };

    // Format difficulty with color
    const getDifficultyColor = (difficulty) => {
        const colors = {
            'Mudah': 'bg-green-100 text-green-800',
            'Easy': 'bg-green-100 text-green-800',
            'Sedang': 'bg-yellow-100 text-yellow-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'Sulit': 'bg-red-100 text-red-800',
            'Hard': 'bg-red-100 text-red-800'
        };
        return colors[difficulty] || 'bg-gray-100 text-gray-800';
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={12}
                className={`${
                    index < rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    const handleViewTutorial = () => {
        console.log('View Tutorial clicked for:', product.name, product.slug); // DEBUG
        if (onViewTutorial) {
            onViewTutorial(product);
        }
    };

    if (viewMode === 'list') {
        return (
            <div className="bg-white border border-gray-200 rounded-none p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0 w-48 h-32">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-none cursor-pointer"
                            onClick={handleViewTutorial}
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full font-lato">
                                        {product.categoryName}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full font-lato ${getDifficultyColor(product.difficulty)}`}>
                                        {product.difficulty}
                                    </span>
                                </div>
                                <h3 
                                    className="font-lato font-medium text-lg text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors"
                                    onClick={handleViewTutorial}
                                >
                                    {product.name}
                                </h3>
                                <p className="font-lato text-gray-600 text-sm line-clamp-2 mb-3">
                                    {product.description}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="font-lato text-2xl font-bold text-gray-900 mb-1">
                                    {formatPrice(product.price)}
                                </div>
                                <div className="text-sm text-gray-500 font-lato">one-time purchase</div>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span className="font-lato">{product.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <BookOpen size={14} />
                                <span className="font-lato">{product.stepCount} steps</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span className="font-lato">{product.materialCount} materials</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {renderStars(Math.round(product.rating))}
                                <span className="font-lato ml-1">
                                    {product.rating.toFixed(1)} ({product.ratingCount})
                                </span>
                            </div>
                        </div>

                        {/* Actions - Only View Tutorial */}
                        <div>
                            <button
                                onClick={handleViewTutorial}
                                className="w-full px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato flex items-center justify-center gap-2"
                            >
                                <Eye size={16} />
                                View Tutorial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div className="bg-white border border-gray-200 rounded-none overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Image */}
            <div className="aspect-square overflow-hidden cursor-pointer" onClick={handleViewTutorial}>
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category & Difficulty */}
                <div className="flex justify-between items-center mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full font-lato">
                        {product.categoryName}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full font-lato ${getDifficultyColor(product.difficulty)}`}>
                        {product.difficulty}
                    </span>
                </div>

                {/* Title */}
                <h3 
                    className="font-lato font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={handleViewTutorial}
                >
                    {product.name}
                </h3>

                {/* Meta Info */}
                <div className="space-y-1 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span className="font-lato">{product.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BookOpen size={12} />
                            <span className="font-lato">{product.stepCount} steps</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {renderStars(Math.round(product.rating))}
                        <span className="font-lato text-sm text-gray-600 ml-1">
                            {product.rating.toFixed(1)} ({product.ratingCount})
                        </span>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <div className="font-lato text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </div>
                    <div className="text-sm text-gray-500 font-lato">one-time purchase</div>
                </div>

                {/* Actions - Only View Tutorial */}
                <div>
                    <button
                        onClick={handleViewTutorial}
                        className="w-full px-4 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato flex items-center justify-center gap-2"
                    >
                        <Eye size={16} />
                        View Tutorial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;