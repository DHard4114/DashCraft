import React, { useRef, useState, useEffect } from 'react';

const dummyProducts = [
    { id: 1, name: "Macrame Wall Hanging", image: "/assets/macrame.jpg", price: "$25" },
    { id: 2, name: "Wooden Candle Holder", image: "/assets/candle.jpg", price: "$15" },
    { id: 3, name: "Handmade Clay Pot", image: "/assets/claypot.jpg", price: "$30" },
    { id: 4, name: "Vintage Key Holder", image: "/assets/keyholder.jpg", price: "$18" },
    { id: 5, name: "Painted Flower Vase", image: "/assets/vase.jpg", price: "$22" },
    { id: 6, name: "DIY Beaded Coaster", image: "/assets/coaster.jpg", price: "$12" },
    { id: 7, name: "Mini Plant Shelf", image: "/assets/shelf.jpg", price: "$28" },
    { id: 8, name: "Knitted Pot Cover", image: "/assets/potcover.jpg", price: "$14" },
    { id: 9, name: "Custom Wall Art", image: "/assets/wallart.jpg", price: "$35" },
    { id: 10, name: "Hand-Painted Tray", image: "/assets/tray.jpg", price: "$20" },
];

const ProductGrid = () => {
    const scrollContainerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemWidth = 270; // 256px card width + 16px gap
    const visibleItems = 4; // Approximate number of visible items based on container width
    
    // Function to scroll one item to the left with looping
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const newIndex = currentIndex === 0 ? dummyProducts.length - 1 : currentIndex - 1;
            setCurrentIndex(newIndex);
            
            // If at the beginning, loop to the end
            if (currentIndex === 0) {
                // Instantly jump to the end without animation
                scrollContainerRef.current.scrollLeft = (dummyProducts.length - visibleItems) * itemWidth;
                // Force reflow
                scrollContainerRef.current.getBoundingClientRect();
                // Then animate one item to the left
                setTimeout(() => {
                    scrollContainerRef.current.scrollBy({ 
                        left: -itemWidth, 
                        behavior: 'smooth' 
                    });
                }, 50);
            } else {
                // Normal scroll left
                scrollContainerRef.current.scrollBy({ 
                    left: -itemWidth, 
                    behavior: 'smooth' 
                });
            }
        }
    };
    
    // Function to scroll one item to the right with looping
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const newIndex = (currentIndex + 1) % dummyProducts.length;
            setCurrentIndex(newIndex);
            
            // If at the end, loop to the beginning
            if (currentIndex >= dummyProducts.length - visibleItems) {
                // Animate the last movement
                scrollContainerRef.current.scrollBy({ 
                    left: itemWidth, 
                    behavior: 'smooth' 
                });
                
                // After animation completes, jump to beginning
                setTimeout(() => {
                    scrollContainerRef.current.scrollTo({ 
                        left: 0, 
                        behavior: 'auto' 
                    });
                }, 300);
            } else {
                // Normal scroll right
                scrollContainerRef.current.scrollBy({ 
                    left: itemWidth, 
                    behavior: 'smooth' 
                });
            }
        }
    };
    
    // Update currentIndex on scroll
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollPos = scrollContainerRef.current.scrollLeft;
            const newIndex = Math.round(scrollPos / itemWidth);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < dummyProducts.length) {
                setCurrentIndex(newIndex);
            }
        }
    };
    
    // Add scroll event listener
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            
            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, [currentIndex]);
    
    return (
        <div className="relative w-full">
            {/* Elegant title with subtle underline */}
            <h2 className="text-2xl font-mono font-light mb-6 pb-2 inline-block border-b border-gray-200">
                Our Creations
            </h2>
            
            {/* Horizontal scrolling container with navigation buttons */}
            <div className="relative">
                {/* Left navigation button (always visible with looping) */}
                <button 
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
                    aria-label="Previous item"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </button>
                
                {/* Right navigation button (always visible with looping) */}
                <button 
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
                    aria-label="Next item"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
                
                {/* Scrollable container */}
                <div 
                    ref={scrollContainerRef}
                    className="w-full overflow-x-auto pb-6 scrollbar-hide"
                >
                    <div className="flex space-x-6 px-1">
                        {dummyProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex-shrink-0 w-64 bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-4 font-mono">
                                    <h3 className="text-lg font-light tracking-wide">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{product.price}</p>
                                    <button className="mt-3 text-xs px-4 py-2 border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50 transition-colors duration-300">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Dot indicators */}
            <div className="flex justify-center mt-4 space-x-2">
                <div className="flex space-x-1">
                    {dummyProducts.slice(0, 5).map((_, i) => (
                        <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                                (currentIndex % 5) === i ? 'bg-gray-400' : 'bg-gray-200'
                            }`}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;