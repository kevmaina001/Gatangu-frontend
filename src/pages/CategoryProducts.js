import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaSort, 
  FaTag, 
  FaShoppingBag,
  FaExclamationTriangle
} from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import EnhancedLoader from '../components/EnhancedLoader';
import SEO from '../components/SEO';
import axios from '../services/api';
import { ProductCache } from '../utils/cacheUtils';
import useAutoRetry from '../hooks/useAutoRetry';
import { getAdaptiveRetryConfig, globalRetryStats } from '../config/retryConfig';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [showCachedData, setShowCachedData] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Auto-retry fetch function for category products
  const fetchCategoryProductsWithRetry = async ({ signal, attemptNumber }) => {
    // Check for cached data on first attempt only
    if (attemptNumber === 0) {
      const cachedCategoryProducts = ProductCache.getCategoryProducts(categoryName);
      if (cachedCategoryProducts) {
        setProducts(cachedCategoryProducts);
        setShowCachedData(true);
        return cachedCategoryProducts;
      }

      // Try to get from general products cache and filter
      const cachedAllProducts = ProductCache.getProducts();
      if (cachedAllProducts) {
        const filtered = cachedAllProducts.filter(
          (product) =>
            product.category && product.category.toLowerCase() === categoryName.toLowerCase()
        );
        if (filtered.length > 0) {
          setProducts(filtered);
          setShowCachedData(true);
          return filtered;
        }
      }
    }

    // Make network request with abort signal
    const response = await axios.getWithRetry('/products', { signal });
    const filtered = response.data.filter(
      (product) =>
        product.category && product.category.toLowerCase() === categoryName.toLowerCase()
    );
    
    // Update products and cache
    setProducts(filtered);
    setShowCachedData(false);
    ProductCache.setCategoryProducts(categoryName, filtered);
    
    return filtered;
  };

  // Get adaptive retry configuration for category products
  const retryConfig = getAdaptiveRetryConfig('CATEGORY_PRODUCTS');

  // Use auto-retry hook with adaptive configuration
  const {
    data: fetchedProducts,
    loading,
    error,
    isRetrying,
    retryCount,
    retryStage,
    manualRetry,
    isInRetryMode,
    nextRetryDelay
  } = useAutoRetry(fetchCategoryProductsWithRetry, {
    ...retryConfig,
    onRetryAttempt: (attempt, error, delay) => {
      console.log(`Retrying category products fetch - attempt ${attempt}, next delay: ${delay}ms`);
      globalRetryStats.recordAttempt(false, delay, attempt);
    },
    onMaxRetriesReached: (error) => {
      console.error('Max retries reached for category products fetch:', error);
      globalRetryStats.recordAttempt(false, 0, retryConfig.maxRetries);
      
      // Check if we have cached data to fall back to
      const cachedProducts = ProductCache.getCategoryProducts(categoryName);
      if (cachedProducts) {
        setProducts(cachedProducts);
        setShowCachedData(true);
      }
    }
  });

  // Update products when fetchedProducts changes or categoryName changes
  useEffect(() => {
    if (fetchedProducts) {
      setProducts(fetchedProducts);
    }
  }, [fetchedProducts]);

  // Reset and refetch when category changes
  useEffect(() => {
    setProducts([]);
    setShowCachedData(false);
    // The useAutoRetry hook will automatically trigger a new fetch
  }, [categoryName]);


  // Sort and filter products
  useEffect(() => {
    let sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  }, [products, sortBy]);

  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
  };

  return (
    <>
      <SEO 
        title={`${formatCategoryName(categoryName)} Products - Gatangu | Buy Online Kenya`}
        description={`Shop ${formatCategoryName(categoryName).toLowerCase()} products at Gatangu. Quality items with fast delivery across Kenya. Best prices guaranteed.`}
        keywords={`${formatCategoryName(categoryName)}, ${categoryName} products, buy ${categoryName} online kenya, gatangu ${categoryName}, online shopping kenya`}
        type="website"
        category={formatCategoryName(categoryName)}
        image={`${window.location.origin}/images/category-${categoryName}-og.jpg`}
        url={window.location.href}
      />
      <div className="min-h-screen bg-backgroundLight pt-32 pb-28 md:pb-20">
        <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Home</span>
          </Link>

          {/* Category Header */}
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mr-4">
              <FaTag className="text-primary-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 mb-1">
                {formatCategoryName(categoryName)}
              </h1>
              <p className="text-secondary-600">
                Discover products in this category
              </p>
            </div>
          </div>

          {/* Results Count & Controls */}
          {!loading && !error && products.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white rounded-xl shadow-soft border border-secondary-100">
              <div className="flex items-center">
                <FaShoppingBag className="text-primary-600 mr-2" />
                <span className="text-secondary-600">
                  <span className="font-semibold text-secondary-800">{products.length}</span> product{products.length !== 1 ? 's' : ''} available
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <FaSort className="text-secondary-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-secondary-200 rounded-lg px-3 py-2 text-secondary-700 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Cached Data Notice */}
        {showCachedData && !loading && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <FaTag className="text-white text-sm" />
              </div>
              <div>
                <p className="text-blue-800 font-medium text-sm">
                  Showing cached {formatCategoryName(categoryName)} products
                </p>
                <p className="text-blue-600 text-xs">
                  Products will auto-refresh when connection improves
                </p>
              </div>
            </div>
            <motion.button
              onClick={manualRetry}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Refresh Now
            </motion.button>
          </motion.div>
        )}

        {/* Content */}
        {(loading || isInRetryMode) && !showCachedData ? (
          <EnhancedLoader 
            isLoading={loading || isRetrying}
            hasError={error && !isInRetryMode}
            onRetry={manualRetry}
            showCachedData={showCachedData}
            loadingText={`Loading ${formatCategoryName(categoryName)} Products...`}
            // Auto-retry specific props
            autoRetryMode={true}
            isRetrying={isRetrying}
            retryCount={retryCount}
            retryStage={retryStage}
            nextRetryDelay={nextRetryDelay}
            maxRetries={retryConfig.maxRetries}
          />
        ) : error && !showCachedData && !isInRetryMode ? (
          <EnhancedLoader 
            isLoading={false} 
            hasError={true}
            onRetry={manualRetry}
            showCachedData={showCachedData}
            errorMessage={error}
            autoRetryMode={false}
          />
        ) : filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaTag className="text-secondary-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">
              No Products Found
            </h3>
            <p className="text-secondary-500 mb-6 max-w-md mx-auto">
              We don't have any products in the "{formatCategoryName(categoryName)}" category yet. Check back soon or browse other categories!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.history.back()}
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go Back
              </motion.button>
              <Link
                to="/"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-block text-center"
              >
                Browse All Products
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
};

export default CategoryProducts;
