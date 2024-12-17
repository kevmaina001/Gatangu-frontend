import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Use dynamic API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <Link
      to={`/products/${product._id}`}
      className="block border border-gray-200 p-4 hover:shadow-lg transition-shadow rounded-lg"
      style={{
        backgroundColor: '#ffffff',
        width: '90%',
        margin: 'auto',
      }}
    >
      {/* Image Container */}
      <div
        className="w-full h-48 flex items-center justify-center mb-4 bg-gray-100 rounded-md overflow-hidden"
      >
        <img
          src={`${API_URL}/${product.image}`}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Product Name */}
      <h3
        className="text-gray-800 mb-2 text-center font-semibold"
        style={{
          fontFamily: `'Poppins', serif`,
          fontSize: '1.1rem',
        }}
      >
        {product.name}
      </h3>

      {/* Product Price */}
      <p
        className="text-gray-700 text-center"
        style={{
          fontFamily: `'Playfair Display', serif`,
          fontSize: '1rem',
        }}
      >
        <span className="font-bold">ksh.</span> {product.price}
      </p>
    </Link>
  );
};

export default ProductCard;
