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
import axios from '../services/api';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/products');
        const filtered = response.data.filter(
          (product) =>
            product.category && product.category.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filtered);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
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

        {/* Content */}
        {loading ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-secondary-700 mb-2">
              Loading Products...
            </h3>
            <p className="text-secondary-500">
              Please wait while we fetch products in {formatCategoryName(categoryName)}
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-700 mb-2">
              Error Loading Category
            </h3>
            <p className="text-red-500 mb-6">{error}</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
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
  );
};

export default CategoryProducts;
