import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// AuthModal component that handles both login and register functionality
const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  
  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    setFormData({
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
    setError('');
    setMode(initialMode);
  }, [isOpen, initialMode]);

  // Close modal when clicking outside (the backdrop)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      mode === 'login' ? handleSignIn(e) : handleRegister(e);
    }
  };

  // Handle login - Updated for backend response structure
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Make sure we're using 'email' field name
      const credentials = {
        email: formData.email, // Backend expects 'email'
        password: formData.password
      };

      console.log('Login credentials:', credentials); // Debug log

      const result = await login(credentials);
      
      if (result.success) {
        onClose();
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}user/register`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        alert("Registration successful! Please login.");
        setMode('login');
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={handleBackdropClick}
    >
      <div className="max-w-md w-full bg-white rounded-sm p-6 border border-gray-300 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-mono text-gray-800 tracking-wide">
            {mode === 'login' ? 'Login' : 'Register'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-mono text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-mono text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                required
                minLength="6"
              />
            </div>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full border border-black bg-white text-black hover:border-black font-mono py-2 rounded-sm transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#050505] hover:text-white'
              }`}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="text-center text-sm space-y-2">
              <p>Belum punya akun? 
                <button 
                  type="button" 
                  onClick={() => setMode('register')}
                  className="text-blue-500 hover:underline ml-1"
                >
                  Daftar
                </button>
              </p>
              <p>
                <button type="button" className="text-blue-500 hover:underline">
                  Forgot Password?
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-mono text-gray-700">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-mono text-gray-700">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
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
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-mono text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-mono text-gray-700">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-mono text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                required
                minLength="6"
              />
            </div>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#FFFFF] border-2 text-black font-mono py-2 rounded-sm transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#020202] hover:border-gray-600 hover:text-white'
              }`}
            >
              {isLoading ? "Loading..." : "Register"}
            </button>

            <div className="text-center text-sm space-y-2">
              <p>Sudah punya akun? 
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-500 hover:underline ml-1"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;