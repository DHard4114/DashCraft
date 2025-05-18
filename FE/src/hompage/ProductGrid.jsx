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
            setProducts(response.data.data);
            console.log("PRODUCT RESPONSE:", response.data);
            
            if (response.data.success) {
                
                setProducts(response.data.payload.slice(0, 5));
            } else {
                setError(response.data.message || "Failed to fetch products");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch data from server");
        }
    };

   //const totalDots = Math.ceil(products.length / productsPerSlide);

    const {
        scrollContainerRef,
        currentIndex,
        extendedItems,
        scrollLeft,
        scrollRight,
        jumpToIndex
    } = useCarousel(products.length > 0 ? products : [], itemWidth);

    return (
        <div className="relative w-full max-w-[1200px] mx-auto">
            {error && <div className="text-[#fc7b7b] text-center mb-4">{error}</div>}
            <h2 className="text-2xl font-mono font-light mb-6 pb-2 inline-block border-b border-gray-200">
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
                            <ProductCard key={`${product.id}-${idx}`} product={product} />
                        ))}
                    </div>
                </div>
            </div>
            <DotIndicators total={extendedItems.length} currentIndex={currentIndex} onClick={jumpToIndex} />
        </div>
    );
};

export default ProductGrid;
