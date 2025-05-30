/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        console.log('Initializing auth - Token:', savedToken ? 'exists' : 'missing');
        console.log('Initializing auth - User:', savedUser ? 'exists' : 'missing');
        
        if (savedToken && savedUser) {
          // Verify token is still valid
          try {
            const response = await axios.get(`${import.meta.env.VITE_API}user/verify`, {
              headers: { Authorization: `Bearer ${savedToken}` }
            });
            
            console.log('Token verification response:', response.data);
            
            if (response.data.success) {
              setToken(savedToken);
              setUser(JSON.parse(savedUser));
              setIsAuthenticated(true);
              
              // Set default axios header
              axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
            } else {
              // Token invalid, clear storage
              clearAuth();
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Ensure we're sending the correct field names
      const loginData = {
        email: credentials.email || credentials.username, // Backend expects 'email'
        password: credentials.password
      };

      console.log('Sending login request with:', loginData); // Debug log
      
      const response = await axios.post(
        `${import.meta.env.VITE_API}user/login`,
        loginData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Login response:', response.data); // Debug log

      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Store user and token
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user, token };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = 'Please provide valid email and password';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}user/register`, userData);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.error || response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let message = 'Registration failed';
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      return { success: false, message };
    }
  };

  const logout = () => {
    console.log('Logging out user');
    clearAuth();
  };

  const getAuthHeaders = () => {
    const currentToken = token || localStorage.getItem('token');
    return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    login,
    register,
    logout,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
