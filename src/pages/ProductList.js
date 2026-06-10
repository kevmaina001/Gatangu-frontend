import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShoppingBag,
  FaSort,
  FaSearch,
  FaTh,
  FaList,
  FaTag,
  FaFire,
  FaFilter,
  FaTimes,
  FaPills,
  FaTools,
  FaBaby,
  FaAppleAlt,
  FaLightbulb,
  FaBreadSlice,
  FaOilCan,
  FaWineBottle,
  FaSeedling,
  FaClipboardList,
  FaCoffee,
  FaBoxOpen
} from 'react-icons/fa';
import VirtualizedProductGrid from '../components/VirtualizedProductGrid';
import EnhancedLoader from '../components/EnhancedLoader';
import SEO from '../components/SEO';
import axios from '../services/api';
import { CATEGORY_DISPLAY } from '../utils/categories';
import { ProductCache } from '../utils/cacheUtils';

const PAGE_SIZE = 20;

const getIconForCategory = (categoryName) => {
  switch (categoryName) {
    case 'All': return FaShoppingBag;
    case 'Lighters': return FaFire;
    case 'Groceries': return FaAppleAlt;
    case 'Personal Care': return FaPills;
    case 'Flour & Rice': return FaBreadSlice;
    case 'Hardware': return FaTools;
    case 'Fats & Oils': return FaOilCan;
    case 'Baby Hygiene': return FaBaby;
    case 'Animal Health': return FaPills;
    case 'Food Additives': return FaClipboardList;
    case 'Bakery': return FaBreadSlice;
    case 'Farm Inputs': return FaSeedling;
    case 'Spreads': return FaOilCan;
    case 'Lightings': return FaLightbulb;
    case 'Stationery': return FaClipboardList;
    case 'Beverages': return FaCoffee;
    case 'Wholesale': return FaBoxOpen;
    case 'Milk': return FaWineBottle;
    case 'Medicine': return FaPills;
    default: return FaTag;
  }
};

// Category options use the category NAME as their value ('all' = no filter).
const categories = CATEGORY_DISPLAY.map(cat => ({
  name: cat.name,
  value: cat.name === 'All' ? 'all' : cat.name,
  icon: getIconForCategory(cat.name),
}));

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showCachedData, setShowCachedData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const hasMore = products.length < total;
  const isDefaultView =
    selectedCategory === 'all' && !debouncedSearch && sortBy === 'featured';

  // Debounce the search box so we don't fire a request per keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query params for the current filter/sort/search state
  const buildParams = useCallback(
    (pageNum) => {
      const params = { page: pageNum, limit: PAGE_SIZE };
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (debouncedSearch) params.search = debouncedSearch;
      if (sortBy && sortBy !== 'featured') params.sort = sortBy;
      return params;
    },
    [selectedCategory, debouncedSearch, sortBy]
  );

  // Fetch a page. append=true keeps existing items (Load More); false replaces.
  const fetchPage = useCallback(
    async (pageNum, append) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const res = await axios.getWithRetry('/products', { params: buildParams(pageNum) });
        const data = res.data;
        // Backend returns { total, products } when paginated, or a bare array otherwise
        const items = Array.isArray(data) ? data : data.products || [];
        const totalCount = Array.isArray(data) ? items.length : data.total ?? items.length;

        setTotal(totalCount);
        setProducts((prev) => (append ? [...prev, ...items] : items));
        setPage(pageNum);
        setShowCachedData(false);

        // Cache the first page of the default view for offline fallback
        if (!append && pageNum === 1 && isDefaultView) {
          ProductCache.setProducts(items);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err);

        // Fall back to cached default-view products if we have them
        if (!append && pageNum === 1) {
          const cached = ProductCache.getProducts();
          if (cached && cached.length) {
            setProducts(cached);
            setShowCachedData(true);
          }
        }
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [buildParams, isDefaultView]
  );

  // (Re)load page 1 whenever the filter/search/sort changes
  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) fetchPage(page + 1, true);
  };

  const manualRetry = () => fetchPage(1, false);

  return (
    <>
      <SEO
        title="Shop All Products - Gatangu | Online Shopping Kenya"
        description="Browse our complete collection of fresh groceries, personal care, and household items. Quality products with fast delivery across Kenya. Shop now at Gatangu!"
        keywords="shop all products, online shopping kenya, groceries, household items, personal care, gatangu shop, buy online kenya"
        type="website"
        image={`${window.location.origin}/images/gatangu-shop-og.jpg`}
        url={window.location.href}
      />
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
              <div className="text-xl sm:text-2xl font-bold text-primary-600">{total}+</div>
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

        {/* Search Bar - Always Visible */}
        <motion.div
          className="bg-white rounded-2xl shadow-medium p-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-secondary-800 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </motion.div>

        {/* Mobile Filter Button & Desktop Filters */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg font-medium"
            >
              <FaFilter className="text-sm" />
              Filters
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary-600">
                {total} found
              </span>
              <div className="flex items-center bg-white rounded-lg border border-secondary-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'text-secondary-500'
                  }`}
                >
                  <FaTh className="text-sm" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'text-secondary-500'
                  }`}
                >
                  <FaList className="text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:block bg-white rounded-2xl shadow-medium p-6">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.value;
                return (
                  <motion.button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                      isSelected
                        ? 'bg-primary-500 text-white shadow-medium'
                        : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="mr-2" />
                    {category.name}
                  </motion.button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
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

              <div className="flex items-center gap-4">
                <span className="text-secondary-600 font-medium">
                  {total} product{total !== 1 ? 's' : ''} found
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
          </div>
        </motion.div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
              />

              {/* Drawer */}
              <motion.div
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto md:hidden"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-secondary-800">Filters & Sort</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                    >
                      <FaTimes className="text-secondary-600" />
                    </button>
                  </div>

                  {/* Sort Section */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-secondary-700 mb-3">Sort By</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'featured', label: 'Featured' },
                        { value: 'name', label: 'Name A-Z' },
                        { value: 'price-low', label: 'Price: Low to High' },
                        { value: 'price-high', label: 'Price: High to Low' },
                        { value: 'newest', label: 'Newest First' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                            sortBy === option.value
                              ? 'bg-primary-500 text-white'
                              : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Section */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-secondary-700 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => {
                        const IconComponent = category.icon;
                        const isSelected = selectedCategory === category.value;
                        return (
                          <button
                            key={category.value}
                            onClick={() => {
                              setSelectedCategory(category.value);
                              setShowMobileFilters(false);
                            }}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                              isSelected
                                ? 'bg-primary-500 text-white'
                                : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
                            }`}
                          >
                            <IconComponent className="mr-3" />
                            {category.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSortBy('featured');
                        setSearchQuery('');
                      }}
                      className="flex-1 bg-secondary-100 text-secondary-700 py-3 rounded-lg font-medium"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
                <FaShoppingBag className="text-white text-sm" />
              </div>
              <div>
                <p className="text-blue-800 font-medium text-sm">
                  Showing cached products
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
        {loading && !showCachedData ? (
          <EnhancedLoader
            isLoading={true}
            hasError={false}
            onRetry={manualRetry}
            showCachedData={showCachedData}
            loadingText="Loading Our Fresh Products..."
            autoRetryMode={false}
          />
        ) : error && !showCachedData && products.length === 0 ? (
          <EnhancedLoader
            isLoading={false}
            hasError={true}
            onRetry={manualRetry}
            showCachedData={showCachedData}
            errorMessage="We're having trouble reaching our servers. Please try again."
            autoRetryMode={false}
          />
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Featured Products Banner */}
            {isDefaultView && (
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
            <VirtualizedProductGrid
              products={products}
              viewMode={viewMode}
            />

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <motion.button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`px-8 py-3 rounded-xl font-medium transition-colors ${
                    loadingMore
                      ? 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                  whileHover={loadingMore ? {} : { scale: 1.05 }}
                  whileTap={loadingMore ? {} : { scale: 0.95 }}
                >
                  {loadingMore
                    ? 'Loading...'
                    : `Load More (${products.length} of ${total})`}
                </motion.button>
              </div>
            )}
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
    </>
  );
};

export default ProductList;
