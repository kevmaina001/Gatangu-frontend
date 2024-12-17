import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Determine base URL for local vs production environments
  const baseURL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://gatangu-backend-1.onrender.com';

  // Get the final image URL
  const getFinalImageURL = (imagePath) => {
    if (!imagePath) return '/fallback.jpg'; // Fallback image

    // Return external or Cloudinary URLs directly
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Handle local uploads and clean path
    const cleanedPath = imagePath.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\/+/, '');
    return `${baseURL}/${cleanedPath.includes('uploads/') ? cleanedPath : `uploads/${cleanedPath}`}`;
  };

  const finalImageURL = getFinalImageURL(product.image);

  return (
    <Link
      to={`/products/${product._id}`}
      className="block border border-gray-200 p-4 hover:shadow-lg transition-shadow bg-white w-11/12 mx-auto"
    >
      {/* Product Image */}
      <div className="w-full h-48 flex items-center justify-center overflow-hidden mb-4 bg-gray-100">
        <img
          src={finalImageURL}
          alt={product.name}
          className="object-cover max-h-full max-w-full"
          onError={(e) => (e.target.src = '/fallback.jpg')} // Fallback image
        />
      </div>

      {/* Product Name */}
      <h3 className="text-gray-800 mb-1 font-medium text-center text-lg">
        {product.name}
      </h3>

      {/* Product Price */}
      <p className="text-gray-600 text-center text-sm">
        Ksh. {product.price}
      </p>
    </Link>
  );
};

export default ProductCard;
