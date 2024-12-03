import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="block border border-white p-4 hover:shadow-lg transition-shadow"
      style={{
        backgroundColor: '#ffffff', // Plain white background
        width: '90%', // Consistent card size
        margin: 'auto', // Center the card
      }}
    >
      <div
        className="w-full h-48 flex items-center justify-center mb-4"
        style={{
          overflow: 'hidden', // Prevent overflow
          backgroundColor: '#ffffff', // Remove grey effect
        }}
      >
        <img
          src={`https://gatangu-backend-1.onrender.com/${product.image}`}
          alt={product.name}
          className="object-cover"
          style={{
            maxHeight: '100%', // Scale within container
            maxWidth: '100%',
          }}
        />
      </div>
      <h3
        className="text-gray-800 mb-1 font-medium text-center"
        style={{
          fontSize: '1rem',
          fontFamily: `'Roboto Condensed', sans-serif`,
        }}
      >
        {product.name}
      </h3>
      <p
        className="text-gray-600 text-center"
        style={{
          fontSize: '0.9rem',
        }}
      >
        ksh. {product.price}
      </p>
    </Link>
  );
};

export default ProductCard;
