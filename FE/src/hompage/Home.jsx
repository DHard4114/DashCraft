import React from 'react';
import ProductGrid from './ProductGrid';
import Contact from './Contact';

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
            
            {/* Product Grid */}
            <section className="py-16 px-4 md:px-12 lg:px-20">
                <h2 className="text-3xl font-medium mb-10 text-center">
                    Our DIY Collection
                </h2>
                <ProductGrid />
            </section>

            {/* Contact / Footer */}
            <section className="bg-white py-12 px-6 shadow-inner">
                <Contact />
            </section>
        </div>
    );
};

export default Home;
