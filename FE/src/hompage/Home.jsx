import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import Contact from './Contact';
import axios from 'axios';

const Home = () => {
    const [mainProduct, setMainProduct] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const storeId = localStorage.getItem('store_id');
        if (storeId) {
            fetchMainProduct(storeId);
        } else {
            setError('Store ID not found in localStorage');
        }
    }, []);

    const fetchMainProduct = async (storeId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}item/byStoreId/${storeId}`);
            const mainProduct = response.data.payload.find(item => item.name === 'mainproduct');

            if (mainProduct) {
                setMainProduct(mainProduct);
            } else {
                setError('Main product not found');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch main product");
        }
    };

    return (
        <div className="w-full min-h-screen bg-white py-12 flex flex-col space-y-16 items-center ">

            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between w-full  rounded-none overflow-hidden transform transition-all duration-700 ease-in-out hover:scale-105">
                
                {/* Left: Image */}
                <div className="w-full lg:w-1/2 h-[500px] bg-gray-200 rounded-sm overflow-hidden  transition-all duration-500 ease-in-out hover:shadow-2xl">
                    {mainProduct ? (
                        <img
                            src={mainProduct.image_url}
                            alt={mainProduct.name}
                            className="w-full h-full object-cover rounded-sm transform transition-all duration-500 ease-in-out hover:scale-105"
                        />
                    ) : (
                        <p className="text-center text-lg text-gray-500">{error || "Loading..."}</p>
                    )}
                </div>

                {/* Right: Text */}
                <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center bg-white transition-all duration-500 ease-in-out transform hover:scale-105">
                    <h2 className="text-3xl font-mono text-gray-900 mb-6 transform transition-all duration-500 ease-in-out hover:text-indigo-600">
                        DashCraft All-Purpose Dash
                    </h2>
                    <p className="text-black font-mono text-lg leading-relaxed opacity-80 hover:opacity-100 transition-all duration-500 ease-in-out">
                        Transform your world with color! For over 100 years, DyeCraft All-Purpose Dye has been the go-to product for giving your fabrics—old or new—a fresh, vibrant makeover.
                        Whether it’s cotton, wool, silk, or even synthetics like nylon and rayon, DyeCraft makes it easy to bring your chosen color to life.
                        Non-toxic, simple, and full of possibilities—perfect for everything from clothes to home décor. Make your creations shine with DyeCraft!
                    </p>
                </div>
            </div>

            {/* Product Grid Section */}
            <div className="w-full mt-12">
                <ProductGrid />
            </div>
                <Contact />
            <div className="w-full mt-6">
            </div>
        </div>
    );
};

export default Home;
