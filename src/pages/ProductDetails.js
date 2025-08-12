import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaHeart, 
  FaShare, 
  FaPlus, 
  FaMinus,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheckCircle,
  FaTruck,
  FaUndo
} from 'react-icons/fa';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFinalImageURL, handleImageError, getProductImages } from '../utils/imageUtils';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (product && !addingToCart) {
      setAddingToCart(true);
      try {
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart!`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
        
        setTimeout(() => {
          setQuantity(1);
          setAddingToCart(false);
        }, 1000);
      } catch (error) {
        setAddingToCart(false);
        toast.error('Failed to add item to cart');
      }
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.info(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      { autoClose: 2000 }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Gatangu Enterprise`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-backgroundLight pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-secondary-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-6 bg-secondary-200 rounded w-1/2"></div>
                <div className="h-20 bg-secondary-200 rounded"></div>
                <div className="h-12 bg-secondary-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-backgroundLight pt-32 pb-20 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-error text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-backgroundLight pt-32 pb-20 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-secondary-500 text-lg mb-4">Product not found</div>
          <Link 
            to="/"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-block"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const productImages = getProductImages(product.image);

  return (
    <div className="min-h-screen bg-backgroundLight pt-32 pb-28 md:pb-20">
      <ToastContainer />
      
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <FaArrowLeft />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-medium">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>

            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex space-x-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-primary-500' 
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars()}
                </div>
                <span className="text-sm text-secondary-500">(4.5)</span>
                <span className="text-sm text-secondary-400">•</span>
                <span className="text-sm text-secondary-500">128 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-secondary-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-secondary-800 mb-2">Description</h3>
              <p className="text-secondary-600 leading-relaxed">
                {product.description || 'High-quality product from Gatangu Enterprise. Fresh and reliable for your daily needs.'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-secondary-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-secondary-200 rounded-xl overflow-hidden">
                  <motion.button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaMinus className="text-sm" />
                  </motion.button>
                  <span className="px-6 py-3 font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <motion.button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                    className="p-3 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlus className="text-sm" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaShoppingCart />
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </motion.button>

                <motion.button
                  onClick={handleWishlist}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    isWishlisted 
                      ? 'border-accent-500 bg-accent-50 text-accent-600' 
                      : 'border-secondary-200 hover:border-accent-300 text-secondary-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaHeart className={isWishlisted ? 'text-accent-500' : ''} />
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  className="p-4 rounded-xl border-2 border-secondary-200 hover:border-secondary-300 text-secondary-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShare />
                </motion.button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-secondary-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-secondary-800">Quality Assured</div>
                  <div className="text-sm text-secondary-500">Verified products</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaTruck className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-secondary-800">Fast Delivery</div>
                  <div className="text-sm text-secondary-500">Same day delivery</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUndo className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-secondary-800">Easy Returns</div>
                  <div className="text-sm text-secondary-500">7-day return policy</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
