import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaShoppingBag, 
  FaSort, 
  FaSearch,
  FaTh,
  FaList,
  FaStar,
  FaTag,
  FaFire,
  FaLeaf
} from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import axios from '../services/api';
import { getFinalImageURL, handleImageError } from '../utils/imageUtils';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  
  const categories = [
    { id: 'all', name: 'All Products', icon: FaShoppingBag, color: 'primary' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: FaLeaf, color: 'green' },
    { id: 'bakery', name: 'Bakery', icon: FaTag, color: 'yellow' },
    { id: 'grains', name: 'Grains & Flour', icon: FaLeaf, color: 'orange' },
    { id: 'vegetables', name: 'Fresh Produce', icon: FaLeaf, color: 'green' },
    { id: 'household', name: 'Household', icon: FaShoppingBag, color: 'blue' },
    { id: 'personal-care', name: 'Personal Care', icon: FaStar, color: 'pink' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category && product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // featured
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-32 pb-28 md:pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 shadow-medium"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaShoppingBag className="text-white text-2xl" />
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-800 bg-clip-text text-transparent mb-2">
                Shop Gatangu
              </h1>
              <p className="text-secondary-600 text-base md:text-lg">
                Fresh products delivered to your doorstep
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <motion.div
            className="flex justify-center items-center space-x-4 sm:space-x-8 mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary-600">{products.length}+</div>
              <div className="text-xs sm:text-sm text-secondary-500">Products</div>
            </div>
            <div className="w-px h-6 sm:h-8 bg-secondary-200"></div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-accent-600">Fresh</div>
              <div className="text-xs sm:text-sm text-secondary-500">Daily</div>
            </div>
            <div className="w-px h-6 sm:h-8 bg-secondary-200"></div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">Fast</div>
              <div className="text-xs sm:text-sm text-secondary-500">Delivery</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white rounded-2xl shadow-medium p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Search Bar */}
          <div className="relative mb-4 md:mb-6">
            <FaSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 border border-secondary-200 rounded-xl text-secondary-800 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm md:text-base"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-medium transition-all text-xs md:text-sm ${
                    isSelected
                      ? 'bg-primary-500 text-white shadow-medium'
                      : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="mr-1 md:mr-2 text-xs md:text-sm" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaSort className="text-secondary-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-secondary-200 rounded-lg px-3 py-2 text-secondary-700 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-secondary-600 font-medium">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </span>
              
              <div className="flex items-center bg-secondary-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  <FaTh className="text-sm" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  <FaList className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">
              Loading Our Fresh Products...
            </h3>
            <p className="text-secondary-500">
              Getting the best deals ready for you
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="bg-white rounded-2xl shadow-medium p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-500 mb-6">{error}</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
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
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Featured Products Banner */}
            {selectedCategory === 'all' && (
              <motion.div
                className="bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl p-6 mb-8 text-white"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <FaFire className="mr-2 text-xl" />
                      <span className="font-bold text-lg">Hot Deals!</span>
                    </div>
                    <p className="text-white/90">Special discounts on fresh products today</p>
                  </div>
                  <motion.div
                    className="text-6xl opacity-20"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    🔥
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={viewMode === 'list' ? 'max-w-none' : ''}
                >
                  {viewMode === 'grid' ? (
                    <ProductCard product={product} />
                  ) : (
                    <div className="bg-white rounded-2xl shadow-soft p-6 flex items-center space-x-6">
                      <div className="w-24 h-24 bg-secondary-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={getFinalImageURL(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-800 mb-1">{product.name}</h3>
                        <p className="text-secondary-500 text-sm mb-2">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary-600">
                            {formatPrice(product.price)}
                          </span>
                          <motion.button
                            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-2xl shadow-medium p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-secondary-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">
              No Products Found
            </h3>
            <p className="text-secondary-500 mb-6 max-w-md mx-auto">
              We couldn't find any products matching your search. Try adjusting your filters or search terms.
            </p>
            <motion.button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductList;