import { useState, useEffect, useRef } from "react";

useState
const ImageGallery = () => {
    const images = [
        "/api/placeholder/600/500",
        "/api/placeholder/600/500",
        "/api/placeholder/600/500",
        "/api/placeholder/600/500",
        "/api/placeholder/600/500"
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const delay = 3000;
    
    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
    
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length),
            delay
        );
        
        return () => resetTimeout();
    }, [currentIndex, images.length]);
    
    return (
        <div className="w-full h-full bg-white flex flex-col justify-between relative overflow-hidden">
            {/* Main image area */}
            <div className="flex-1 flex items-center justify-center">
                <div className="relative w-4/5 h-4/5">
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        >
                            <img
                                src={src}
                                className="w-full h-full object-cover"
                                alt={`Handcrafted product ${idx + 1}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Dots navigation - centered at bottom */}
            <div className="flex justify-center pb-8">
                <div className="flex space-x-4">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentIndex ? 'bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;