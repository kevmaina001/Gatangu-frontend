import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const baseURL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://gatangu-backend-1.onrender.com';

  const getSanitizedImagePath = (imagePath) => {
    if (!imagePath) return '';

    // Replace backslashes, remove redundant slashes, clean leading slashes
    let cleanedPath = imagePath.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
    if (cleanedPath.startsWith('/')) cleanedPath = cleanedPath.slice(1);

    return cleanedPath.includes('uploads/') ? cleanedPath : `uploads/${cleanedPath}`;
  };

  const finalImageURL = `${baseURL}/${getSanitizedImagePath(product.image)}`;
  console.log('Base URL:', baseURL);
  console.log('Product Image:', product.image);
  console.log('Final Image URL:', finalImageURL);

  return (
    <Link
      to={`/products/${product._id}`}
      className="block border border-white p-4 hover:shadow-lg transition-shadow"
      style={{
        backgroundColor: '#ffffff',
        width: '90%',
        margin: 'auto',
      }}
    >
      <div
        className="w-full h-48 flex items-center justify-center mb-4"
        style={{
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <img
          src={finalImageURL}
          alt={product.name}
          className="object-cover"
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
          }}
          onError={(e) => {
            console.error('Image failed to load:', finalImageURL);
            e.target.src = '/fallback.jpg'; // Use fallback image on error
          }}
        />
      </div>
      <h3 className="text-gray-800 mb-1 font-medium text-center" style={{ fontSize: '1rem' }}>
        {product.name}
      </h3>
      <p className="text-gray-600 text-center" style={{ fontSize: '0.9rem' }}>
        ksh. {product.price}
      </p>
    </Link>
  );
};

export default ProductCard;
