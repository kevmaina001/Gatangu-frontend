import { jwtDecode } from 'jwt-decode';

const fetchWithAuth = async (url, token, logout, options = {}) => {
  if (!token) {
    console.warn('No token provided. Logging out...');
    logout();
    throw new Error('No token found');
  }

  try {
    // Decode and check token expiration
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      console.warn('Token expired. Logging out...');
      logout();
      throw new Error('Token expired');
    }

    // Proceed with the API request
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle unauthorized access
    if (response.status === 401) {
      console.warn('Unauthorized request. Logging out...');
      logout();
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    console.error('Error in fetchWithAuth:', error.message);
    throw error;
  }
};

export default fetchWithAuth;
