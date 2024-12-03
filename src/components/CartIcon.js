// src/components/CartIcon.js
import React from 'react';
import { Link } from 'react-router-dom';

const CartIcon = ({ itemCount }) => {
  return (
    <div className="relative">
      <Link to="/cart" className="text-gray-600 hover:text-gray-800">
        {/* Cart Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h13.8L17 13m-5 6h.01M9 13h.01"
          />
        </svg>
        {/* Badge for item count */}
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
            {itemCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default CartIcon;
