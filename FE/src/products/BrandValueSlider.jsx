import { useState, useEffect } from "react";

useState
const BrandValueSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;
    const autoplaySpeed = 5000;
    
    const brandValues = [
        {
            title: "CRAFTSMANSHIP",
            heading: "Meticulously handcrafted with attention to every detail",
            description: "Each creation is born from careful selection of materials, precise technique, and the passion of skilled hands. We believe in quality that speaks for itself and endures through time."
        },
        {
            title: "SUSTAINABILITY",
            heading: "Ethical practices for a better tomorrow",
            description: "We prioritize eco-friendly materials and sustainable production methods. Our commitment to the environment guides every decision we make, from sourcing to packaging."
        },
        {
            title: "UNIQUENESS",
            heading: "One-of-a-kind pieces for distinctive spaces",
            description: "No two creations are exactly alike. Each item carries its own character and story, ensuring your space reflects individuality and personal expression."
        }
    ];
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
        }, autoplaySpeed);
        
        return () => clearTimeout(timer);
    }, [currentSlide, totalSlides]);
    
    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };
    
    return (
        <div className="w-full h-full bg-[#e7e5e4] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-40 h-40 bg-[#dad3c7] opacity-30 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#dad3c7] opacity-10 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
            
            {/* Content area */}
            <div className="flex-1 flex items-center justify-center">
                <div className="relative z-10 max-w-md px-8">
                    {brandValues.map((value, index) => (
                        <div 
                            key={index}
                            className={`transition-opacity duration-700 ${
                                currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 absolute'
                            }`}
                        >
                            <h3 className="text-sm font-mono tracking-widest text-gray-600 mb-2">{value.title}</h3>
                            <div className="w-1 h-1 bg-gray-400 rounded-full mb-4"></div>
                            <h2 className="text-3xl font-light mb-6 leading-tight">{value.heading}</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Dots navigation - centered at bottom */}
            <div className="flex justify-center pb-8">
                <div className="flex space-x-4">
                    {[...Array(totalSlides)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                currentSlide === index ? 'bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                            } focus:outline-none`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={currentSlide === index ? 'true' : 'false'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandValueSlider;