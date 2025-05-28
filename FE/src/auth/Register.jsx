import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}user/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.success) {
                alert("Registration successful! Please login.");
                navigate("/auth/login");
            } else {
                setError(response.data.message || "Registration failed");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center min-h-screen bg-[#f3f2f3] p-4 font-lato">
            <div className="max-w-md w-full bg-white rounded-sm p-6 border border-gray-300">
                <h2 className="text-2xl font-mono text-gray-800 text-center mb-4 tracking-wide">Register</h2>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-mono text-gray-700">First Name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-mono text-gray-700">Last Name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-mono text-gray-700">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-mono text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-mono text-gray-700">Phone Number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-mono text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                            required
                            minLength="8"
                        />
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#000000] border-2 text-white font-mono py-2 rounded-sm transition-all ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f5f5f5] hover:text-black hover:border-[#454646]'
                        }`}
                    >
                        {isLoading ? "Loading..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
