import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const delay = 3000;
    
    // Fetch images from backend
    const fetchImages = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Fetch featured items or all items for gallery
            const response = await axios.get(`${import.meta.env.VITE_API}item?limit=10&sortBy=createdAt`);
            
            if (response.data.success) {
                const items = response.data.data || [];
                
                // Extract images from items
                const galleryImages = items
                    .filter(item => item.images && item.images.length > 0) // Only items with images
                    .map(item => {
                        // Get primary image or first image
                        const primaryImage = item.images.find(img => img.isPrimary);
                        const imageUrl = primaryImage?.url || item.images[0]?.url;
                        
                        return {
                            url: imageUrl,
                            title: item.name,
                            id: item._id,
                            slug: item.slug
                        };
                    })
                    .slice(0, 5); // Limit to 5 images for gallery
                
                console.log("Gallery images:", galleryImages); // DEBUG
                setImages(galleryImages);
            } else {
                throw new Error(response.data.message || "Failed to fetch images");
            }
            
        } catch (err) {
            console.error("Error fetching gallery images:", err);
            setError(err.response?.data?.message || err.message || "Failed to load images");
            
            // Fallback to placeholder images
            setImages([
                { url: "/api/placeholder/600/500", title: "Handcrafted Product 1", id: "1" },
                { url: "/api/placeholder/600/500", title: "Handcrafted Product 2", id: "2" },
                { url: "/api/placeholder/600/500", title: "Handcrafted Product 3", id: "3" },
                { url: "/api/placeholder/600/500", title: "Handcrafted Product 4", id: "4" },
                { url: "/api/placeholder/600/500", title: "Handcrafted Product 5", id: "5" }
            ]);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch images on component mount
    useEffect(() => {
        fetchImages();
    }, []);
    
    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
    
    useEffect(() => {
        // Only start slideshow if we have images
        if (images.length > 0) {
            resetTimeout();
            timeoutRef.current = setTimeout(
                () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length),
                delay
            );
        }
        
        return () => resetTimeout();
    }, [currentIndex, images.length]);
    
    // Loading state
    if (loading) {
        return (
            <div className="w-full h-full bg-white flex flex-col justify-between relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-lato">Loading gallery...</p>
                    </div>
                </div>
                
                {/* Placeholder dots */}
                <div className="flex justify-center pb-8">
                    <div className="flex space-x-4">
                        {[...Array(5)].map((_, idx) => (
                            <div key={idx} className="w-2 h-2 rounded-full bg-gray-300"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    // Error state
    if (error && images.length === 0) {
        return (
            <div className="w-full h-full bg-white flex flex-col justify-between relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 mb-4 font-lato">{error}</p>
                        <button 
                            onClick={fetchImages}
                            className="px-4 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                
                {/* Placeholder dots */}
                <div className="flex justify-center pb-8">
                    <div className="flex space-x-4">
                        {[...Array(5)].map((_, idx) => (
                            <div key={idx} className="w-2 h-2 rounded-full bg-gray-300"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    // No images state
    if (images.length === 0) {
        return (
            <div className="w-full h-full bg-white flex flex-col justify-between relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500 font-lato">No images available</p>
                    </div>
                </div>
                
                {/* Empty dots */}
                <div className="flex justify-center pb-8">
                    <div className="flex space-x-4">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full bg-white flex flex-col justify-between relative overflow-hidden">
            {/* Main image area - increased size */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="relative w-4/5 h-4/5 max-w-2xl">
                    {images.map((image, idx) => (
                        <div
                            key={image.id || idx}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        >
                            <img
                                src={image.url}
                                className="w-full h-full object-cover rounded-lg shadow-lg"
                                alt={image.title || `Handcrafted product ${idx + 1}`}
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg';
                                }}
                            />
                            
                            {/* Image overlay with title */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
                                <h3 className="text-white font-lato text-lg font-medium truncate">
                                    {image.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Dots navigation - centered at bottom - matching BrandValueSlider */}
            <div className="flex justify-center pb-8">
                <div className="flex space-x-4">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentIndex ? 'bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                            } focus:outline-none`}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to image ${idx + 1}`}
                            aria-current={idx === currentIndex ? 'true' : 'false'}
                        />
                    ))}
                </div>
            </div>
            
            {/* Error message overlay if there was an error but fallback images loaded */}
            {error && images.length > 0 && (
                <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg text-sm font-lato z-20">
                    Using fallback images
                </div>
            )}
        </div>
    );
};

export default ImageGallery;