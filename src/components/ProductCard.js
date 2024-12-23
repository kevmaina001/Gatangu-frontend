import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Get the final image URL
  const getFinalImageURL = (imagePath) => {
    if (!imagePath) {
      console.warn('Product image is missing for:', product.name);
      return '/fallback.jpg'; // Fallback image
    }

    // Return external or Cloudinary URLs directly
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Handle unexpected local paths (shouldn't occur with Cloudinary)
    console.warn('Unexpected local image path detected:', imagePath);
    return `/fallback.jpg`;
  };

  const finalImageURL = getFinalImageURL(product.image);

  console.log('Rendering Product:', {
    name: product.name,
    image: product.image,
    finalImageURL,
  });

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
          onError={(e) => {
            console.error('Image failed to load:', finalImageURL);
            e.target.src = '/fallback.jpg'; // Fallback image
          }}
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
