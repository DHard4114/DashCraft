import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        localStorage.setItem('store_id', '706ab86b-8371-4c54-9f7a-9fa3b9d18721');
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

            const response = await axios.get(`${import.meta.env.VITE_API}item/byStoreId/${storeId}`);
            console.log("PRODUCT RESPONSE:", response.data);

            if (response.data.success) {
                setProducts(response.data.payload.slice(0, 8));
            } else {
                setError(response.data.message || "Failed to fetch products");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch data from server");
        }
    };

    return (
        <div className="w-full min-h-screen bg-white py-12 px-4 sm:px-8 lg:px-16">
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-4 sm:mx-8 md:mx-12 lg:mx-24">
                {products.map((product, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col items-center space-y-4 transition-all duration-300 ease-in-out hover:scale-105"
                    >
                        <div className="w-full h-[200px] sm:h-[250px] lg:h-[300px] rounded-sm overflow-hidden">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
                            />
                        </div>

                        <p className="font-mono text-center text-black text-lg leading-tight">{product.name}</p>

                        <button className="border border-black px-4 py-2 hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
                            MORE INFO
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
