/**
 * Utility functions for handling image URLs across the application
 */

/**
 * Inject delivery-time transformations into a Cloudinary URL so the browser
 * downloads an image sized for its container instead of the full upload
 * (phone photos can be several MB). f_auto/q_auto also serve WebP/AVIF to
 * browsers that support them. Non-Cloudinary URLs are returned unchanged.
 * @param {string} url - The original image URL
 * @param {number} width - Max width in pixels to deliver (covers 2x screens if doubled by caller)
 * @returns {string} The transformed URL
 */
export const getOptimizedCloudinaryURL = (url, width) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  // Skip URLs that already carry a transformation (e.g. /upload/w_200,.../)
  const afterUpload = url.split('/upload/')[1] || '';
  if (/^[a-z]+_[^/]+\//.test(afterUpload)) {
    return url;
  }
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`);
};

/**
 * Get the final image URL for a product image
 * Handles different image sources: external URLs, backend uploads, and fallback
 * @param {string} imagePath - The image path from the product data
 * @param {number} [width] - Optional max delivery width for Cloudinary images
 * @returns {string} The final URL to use for the image src
 */
export const getFinalImageURL = (imagePath, width) => {
  if (!imagePath) {
    return '/images/placeholder.jpg';
  }

  // Handle external URLs (e.g., Cloudinary, other CDNs)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return width ? getOptimizedCloudinaryURL(imagePath, width) : imagePath;
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
 * @param {number} [width] - Optional max delivery width for Cloudinary images
 * @returns {string[]} Array of final image URLs
 */
export const getProductImages = (images, width) => {
  if (!images) {
    return ['/images/placeholder.jpg'];
  }

  if (Array.isArray(images)) {
    return images.map(img => getFinalImageURL(img, width));
  }

  return [getFinalImageURL(images, width)];
};