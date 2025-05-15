import React from 'react';
import { useCarousel } from '../hooks/useCarousel';
import ProductCard from '../component/productCard';
import ScrollButton from '../component/scrollButton';
import DotIndicators from '../component/DotIndicators';

const dummyProducts = [
    { id: 1, name: "Macrame Wall Hanging", image: "/api/placeholder/250/180", price: "$25" },
    { id: 2, name: "Wooden Candle Holder", image: "/api/placeholder/250/180", price: "$15" },
    { id: 3, name: "Handmade Clay Pot", image: "/api/placeholder/250/180", price: "$30" },
    { id: 4, name: "Vintage Key Holder", image: "/api/placeholder/250/180", price: "$18" },
    { id: 5, name: "Painted Flower Vase", image: "/api/placeholder/250/180", price: "$22" },
    { id: 6, name: "DIY Beaded Coaster", image: "/api/placeholder/250/180", price: "$12" },
    { id: 7, name: "Mini Plant Shelf", image: "/api/placeholder/250/180", price: "$28" },
    { id: 8, name: "Knitted Pot Cover", image: "/api/placeholder/250/180", price: "$14" },
    { id: 9, name: "Custom Wall Art", image: "/api/placeholder/250/180", price: "$35" },
    { id: 10, name: "Hand-Painted Tray", image: "/api/placeholder/250/180", price: "$20" },
];

const ProductGrid = () => {
    const itemWidth = 240;
    const {
        scrollContainerRef,
        currentIndex,
        extendedItems,
        scrollLeft,
        scrollRight,
        jumpToIndex
    } = useCarousel(dummyProducts, itemWidth);

    return (
        <div className="relative w-full max-w-[1200px] mx-auto">
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

            <DotIndicators total={dummyProducts.length} currentIndex={currentIndex} onClick={jumpToIndex} />
        </div>
    );
};

export default ProductGrid;
