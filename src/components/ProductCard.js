import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { getFinalImageURL, handleImageError } from '../utils/imageUtils';
import LazyImage from './LazyImage';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useContext(CartContext);

  const finalImageURL = getFinalImageURL(product.image);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products/${product._id}`}
        className="block bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-medium transition-all duration-300 group-hover:-translate-y-1"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary-50">
          <LazyImage
            src={finalImageURL}
            alt={product.name}
            className="group-hover:scale-110 transition-transform duration-500"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageError(true);
              setImageLoaded(true);
              handleImageError(e);
            }}
          />
          
          {/* Overlay Actions */}
          <motion.div
            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <div className="flex space-x-2">
              <motion.button
                onClick={handleAddToCart}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-primary-500 hover:text-white transition-colors shadow-soft"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart className="text-sm" />
              </motion.button>
              
              <motion.button
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-accent-500 hover:text-white transition-colors shadow-soft"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeart className="text-sm" />
              </motion.button>
              
              <motion.div
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-secondary-800 hover:text-white transition-colors shadow-soft"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEye className="text-sm" />
              </motion.div>
            </div>
          </motion.div>

          {/* Sale Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <motion.div
              className="absolute top-3 left-3 bg-accent-500 text-white px-2 py-1 rounded-lg text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              SALE
            </motion.div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-secondary-800 font-medium text-sm md:text-base line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Category */}
          {product.category && (
            <p className="text-secondary-500 text-xs mb-2 capitalize">
              {product.category}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-primary-600 font-bold text-lg">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-secondary-400 text-sm line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Quick Add Button */}
            <motion.button
              onClick={handleAddToCart}
              className="md:hidden p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart className="text-sm" />
            </motion.button>
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <div className="mt-2">
              {product.stock > 0 ? (
                <span className="text-success text-xs font-medium">
                  In Stock ({product.stock} left)
                </span>
              ) : (
                <span className="text-error text-xs font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
