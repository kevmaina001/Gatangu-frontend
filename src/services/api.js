import axios from 'axios';

// Dynamically set the base URL from environment variables or use a fallback
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Log the base URL for debugging
console.log('Axios baseURL:', baseURL);

// Create an Axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Add Authorization header dynamically if a token exists
    Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`, 
  },
  timeout: 10000, // Set a timeout of 10 seconds
});

// Request interceptor for adding token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Fetch token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Return the response if successful
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Handle specific error statuses
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - redirecting to login.');
      // Optionally, redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.warn('Forbidden - insufficient permissions.');
      alert('You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      console.error('Server error. Please try again later.');
    }

    // Reject the error so it can be handled further down the promise chain
    return Promise.reject(error);
  }
);

export default api;
