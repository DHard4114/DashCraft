import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useCarousel } from '../hooks/useCarousel';
import ProductCard from '../component/productCard';
import ScrollButton from '../component/scrollButton';
import DotIndicators from '../component/DotIndicators';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const itemWidth = 240;

    useEffect(() => {
        localStorage.setItem('store_id', '681a222b4d183cafc20f9e59');
        fetchProductsByStore();
    }, []);
    
    const fetchProductsByStore = async () => {
        setError('');
        try {
            const storeId = localStorage.getItem("store_id");
            if (!storeId) {
                setError("Store ID not found in localStorage");
                return;
            }
            
            const response = await axios.get(`${import.meta.env.VITE_API}item/store/${storeId}`);
            console.log("Full API Response:", response);
            
            let productData = [];
            if (response.data && response.data.data) {
                productData = response.data.data;
            } else if (response.data && response.data.payload) {
                productData = response.data.payload;
            } else if (Array.isArray(response.data)) {
                productData = response.data;
            } else {
                throw new Error("Could not parse product data from response");
            }
            
            const productsWithImages = productData.map(product => ({
                ...product,
                imageUrl: product.imageUrl || `/api/placeholder/225/160?text=${encodeURIComponent(product.name || 'Product')}`
            }));
            
            console.log("Products with images:", productsWithImages);
            setProducts(productsWithImages);
            
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch data from server");
        }
    };

    const {
        scrollContainerRef,
        currentIndex,
        extendedItems,
        scrollLeft,
        scrollRight,
        jumpToIndex
    } = useCarousel(products, itemWidth);

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (products.length === 0) {
        return <div className="text-center p-4">Loading products...</div>;
    }

    return (
        <div className="relative w-full max-w-[1200px] mx-auto">
            <h2 className="text-2xl font-lato  font-light mb-6 pb-2 inline-block border-b border-gray-200">
                Our Creations
            </h2>
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
                            <ProductCard
                                key={`${product._id}-${idx}`}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <DotIndicators
                total={products.length}
                currentIndex={currentIndex}
                onClick={jumpToIndex}
            />
        </div>
    );
};

export default ProductGrid;