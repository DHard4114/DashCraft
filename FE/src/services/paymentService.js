import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const processPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/payment/process`, paymentData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment processing failed');
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await axios.get(`${API_URL}/payment/methods`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
  }
};

export const verifyPayment = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/payment/verify/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};