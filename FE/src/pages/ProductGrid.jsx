import React from 'react';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarousel } from '../hooks/useCarousel';
import DisplayCardProduct from '../components/DisplayCardProduct';
import ScrollButton from '../components/scrollButton';
import DotIndicators from '../components/DotIndicators';

const ProductGrid = ({ categorySlug = null, limit = 10 }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const itemWidth = 240;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            let apiUrl = `${import.meta.env.VITE_API}item`;
            
            // Build query parameters
            const params = new URLSearchParams();
            
            if (categorySlug) {
                // Fetch by category
                apiUrl = `${import.meta.env.VITE_API}item/category/${categorySlug}`;
            } else {
                // Fetch all items with filters
                params.append('limit', limit);
                params.append('page', 1);
                params.append('sortBy', 'createdAt'); // Sort by newest
            }
            
            if (params.toString() && !categorySlug) {
                apiUrl += `?${params.toString()}`;
            }
            
            console.log("API URL:", apiUrl);
            
            const response = await axios.get(apiUrl);
            console.log("API Response:", response.data);
            
            if (response.data.success) {
                const productData = response.data.data || [];
                
                // Process products with proper image handling
                const processedProducts = productData.map(product => ({
                    ...product,
                    // Handle images array from backend
                    imageUrl: product.images && product.images.length > 0 
                        ? product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
                        : `/api/placeholder/225/160?text=${encodeURIComponent(product.name || 'Product')}`,
                    // Format price
                    formattedPrice: typeof product.price === 'number' 
                        ? `Rp${product.price.toLocaleString('id-ID')}`
                        : 'Price unavailable',
                    // Category name from populated data
                    categoryName: product.category?.name || 'Unknown Category',
                    // Creator info
                    creatorName: product.createdBy?.username || 'Unknown Creator',
                    // Rating info
                    rating: product.ratings?.average || 0,
                    ratingCount: product.ratings?.count || 0
                }));
                
                console.log("Processed products:", processedProducts);
                setProducts(processedProducts);
            } else {
                throw new Error(response.data.message || "Failed to fetch products");
            }
            
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, [categorySlug, limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const {
        scrollContainerRef,
        currentIndex,
        extendedItems,
        scrollLeft,
        scrollRight,
        jumpToIndex
    } = useCarousel(products, itemWidth);

    // Handle View Details click
    const handleViewDetails = (product) => {
        console.log('Viewing tutorial details:', product.slug);
        navigate(`/tutorial/${product.slug}`);
    };

    // Handle Add to Cart click (for future use)
    const handleAddToCart = (product) => {
        console.log('Add to cart:', product._id);
        // Navigate to tutorial detail where user can add to cart
        navigate(`/tutorial/${product.slug}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <span className="ml-3 text-gray-600 font-lato">Loading tutorials...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 mb-4 font-lato">{error}</div>
                <button 
                    onClick={fetchProducts}
                    className="px-4 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center p-8">
                <div className="text-gray-500 mb-4 font-lato">No tutorials found</div>
                {categorySlug && (
                    <p className="text-sm text-gray-400 font-lato">
                        No tutorials in this category yet.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-lato font-light pb-2 inline-block border-b border-gray-200">
                    {categorySlug ? `${categorySlug} Tutorials` : 'Featured Tutorials'}
                </h2>
                <div className="text-sm text-gray-500 font-lato">
                    {products.length} tutorial{products.length !== 1 ? 's' : ''}
                </div>
            </div>
            
            <div className="relative">
                <ScrollButton direction="left" onClick={scrollLeft} />
                <ScrollButton direction="right" onClick={scrollRight} />

                <div
                    ref={scrollContainerRef}
                    className="w-full overflow-x-auto pb-6 scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    <div className="flex space-x-4">
                        {extendedItems.map((product, idx) => (
                            <DisplayCardProduct
                                key={`${product._id}-${idx}`}
                                product={product}
                                onViewDetails={handleViewDetails}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {products.length > 3 && (
                <DotIndicators
                    total={products.length}
                    currentIndex={currentIndex}
                    onClick={jumpToIndex}
                />
            )}
        </div>
    );
};

export default ProductGrid;