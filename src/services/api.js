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
  timeout: 30000, // Set a timeout of 30 seconds for better slow connection handling
});

// Retry configuration
const MAX_RETRIES = 4;
const RETRY_DELAYS = [0, 1000, 3000, 5000]; // Delays in milliseconds

// Enhanced retry function with exponential backoff
const retryRequest = async (config, retryCount = 0) => {
  try {
    const response = await axios.request(config);
    return response;
  } catch (error) {
    const shouldRetry = retryCount < MAX_RETRIES && 
                       (error.code === 'ECONNABORTED' || 
                        error.code === 'NETWORK_ERROR' ||
                        (error.response?.status >= 500 && error.response?.status < 600) ||
                        !error.response); // Network errors

    if (shouldRetry) {
      const delay = RETRY_DELAYS[retryCount] || 5000;
      console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES}) after ${delay}ms delay...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(config, retryCount + 1);
    }
    
    throw error;
  }
};

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

    // Handle specific error statuses (but don't show harsh alerts)
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - redirecting to login.');
      // Optionally, redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.warn('Forbidden - insufficient permissions.');
    } else if (error.response?.status >= 500) {
      console.error('Server error. Will retry automatically.');
    }

    // Reject the error so it can be handled further down the promise chain
    return Promise.reject(error);
  }
);

// Enhanced API methods with retry logic
api.getWithRetry = async (url, config = {}) => {
  return retryRequest({ ...config, method: 'GET', url, baseURL: api.defaults.baseURL, headers: { ...api.defaults.headers, ...config.headers } });
};

api.postWithRetry = async (url, data, config = {}) => {
  return retryRequest({ ...config, method: 'POST', url, data, baseURL: api.defaults.baseURL, headers: { ...api.defaults.headers, ...config.headers } });
};

export default api;
