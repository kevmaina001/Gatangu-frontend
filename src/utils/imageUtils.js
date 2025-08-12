/**
 * Utility functions for handling image URLs across the application
 */

/**
 * Get the final image URL for a product image
 * Handles different image sources: external URLs, backend uploads, and fallback
 * @param {string} imagePath - The image path from the product data
 * @returns {string} The final URL to use for the image src
 */
export const getFinalImageURL = (imagePath) => {
  if (!imagePath) {
    return '/images/placeholder.jpg';
  }

  // Handle external URLs (e.g., Cloudinary, other CDNs)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Handle backend uploads
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const cleanPath = imagePath.replace(/^\//, '');
    return `${API_URL}/${cleanPath}`;
  }

  // Fallback for any other cases
  return '/images/placeholder.jpg';
};

/**
 * Handle image loading errors by setting placeholder
 * @param {Event} e - The error event from img element
 */
export const handleImageError = (e) => {
  e.target.src = '/images/placeholder.jpg';
};

/**
 * Get multiple image URLs for products with multiple images
 * @param {string|string[]} images - Single image path or array of image paths
 * @returns {string[]} Array of final image URLs
 */
export const getProductImages = (images) => {
  if (!images) {
    return ['/images/placeholder.jpg'];
  }

  if (Array.isArray(images)) {
    return images.map(img => getFinalImageURL(img));
  }

  return [getFinalImageURL(images)];
};