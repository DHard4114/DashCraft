import React, { useState, useEffect } from 'react';

// AuthModal component that handles both login and register functionality
const AuthModal = ({ isOpen, onClose, initialMode = 'login', onLogin, onRegister }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    setEmail('');
    setUsername('');
    setPassword('');
    setError('');
    setMode(initialMode);
  }, [isOpen, initialMode]);

  // Close modal when clicking outside (the backdrop)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      mode === 'login' ? handleSignIn(e) : handleRegister(e);
    }
  };

  // Handle login
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the onLogin callback provided by parent component
      await onLogin({ email, password });
      onClose();
    } catch (error) {
      setError(error.message || "Login failed");
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
      // Call the onRegister callback provided by parent component
      await onRegister({ username, email, password });
      alert("Registration successful! Please login.");
      setMode('login');
    } catch (error) {
      setError(error.message || "Registration failed");
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
      <div className="max-w-md w-full bg-white rounded-sm p-6 border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-mono text-gray-800 tracking-wide">
            {mode === 'login' ? 'Login' : 'Register'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {mode === 'login' ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-mono text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-mono text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className={`w-full border border-black bg-white text-black hover:border-black font-mono py-2 rounded-sm transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
              }`}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="text-center text-sm space-y-2">
              <p>Belum punya akun? <button 
                type="button" 
                onClick={() => setMode('register')}
                className="text-blue-500 hover:underline"
                >
                  Daftar
                </button>
              </p>
              <p><button type="button" className="text-blue-500 hover:underline">Forgot Password?</button></p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-mono text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-mono text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-mono text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              onClick={handleRegister}
              disabled={isLoading}
              className={`w-full bg-black border-2 text-white font-mono py-2 rounded-sm transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-black hover:border-gray-600'
              }`}
            >
              {isLoading ? "Loading..." : "Register"}
            </button>

            <div className="text-center text-sm space-y-2">
              <p>Sudah punya akun? <button 
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-500 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;