import React, { useState, useEffect, useRef } from 'react';
import ProductGrid from './ProductGrid';
import Contact from './Contact';
import Kelebihan from '../products/Kelebihan';

const BrandValueSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;
    const autoplaySpeed = 5000; // 5 seconds per slide
    
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
    const delay = 3000; // 3 seconds per image
    
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
    }, [currentIndex]);
    
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

const Home = () => {
    return (
        <div className="w-full min-h-screen bg-[#f4f4f4] text-gray-800 font-sans">
            {/* Hero Section */}
            <section className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white shadow-sm">
                <h1 className="text-4xl md:text-5xl font-mono font-normal tracking-wide mb-4">
                    Explore Unique DIY Creations
                </h1>
                <p className="text-lg md:text-xl font-mono text-gray-600 max-w-xl">
                    Handmade, heartfelt, and crafted with care — discover one-of-a-kind items perfect for your space.
                </p>
            </section>
            
            {/* Dynamic Brand Value Section with Sliders */}
            <section className="w-full min-h-screen flex flex-col md:flex-row">
                {/* Left Panel - Dynamic Image Gallery */}
                <div className="w-full md:w-1/2 min-h-screen">
                    <ImageGallery />
                </div>
                
                {/* Right Panel - Brand Value Slider */}
                <div className="w-full md:w-1/2 min-h-screen">
                    <BrandValueSlider />
                </div>
            </section>

            <div className='w-full h-2 bg-[#f8e3f2]'></div>

            {/* Product Grid */}
            <section className="bg-[#ffeaea] py-16 px-4 md:px-12 lg:px-20">
                <div className='items-center flex flex-col bg-[#fcd6d6] p-12 '>
                    <h2 className="text-3xl font-mono font-medium mb-10 text-center">
                        Our DIY Collection
                    </h2>
                    <ProductGrid />
                </div>
            </section>

            <div className='w-full h-2 bg-[#dae6e7]'></div>

            {/*Kelebihan*/}
            <section className='flex flex-row w-full bg-[#e5e9cd] justify-center items-center'>
                <Kelebihan />
            </section>

            <div className='w-full h-2 bg-[#e7ecda]'></div>
            
            {/* Contact / Footer */}
            <section className="bg-white py-12 px-6 shadow-inner">
                <Contact />
            </section>
        </div>
    );
};

export default Home;