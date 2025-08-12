import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import api from '../services/api';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaChevronRight, FaFire, FaTags, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Import slider images from assets
import sliderImage from '../Assets/images/slider.jpg';
import slider1Image from '../Assets/images/slider1.jpg';
import slider2Image from '../Assets/images/slider2.png';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: FaShoppingBag, color: 'bg-primary-500' },
    { name: 'Beverages', icon: FaTags, color: 'bg-blue-500' },
    { name: 'Groceries', icon: FaShoppingBag, color: 'bg-green-500' },
    { name: 'Personal Care', icon: FaTags, color: 'bg-purple-500' },
    { name: 'Household', icon: FaShoppingBag, color: 'bg-pink-500' },
    { name: 'Bakery', icon: FaTags, color: 'bg-orange-500' },
    { name: 'Medicine', icon: FaShoppingBag, color: 'bg-red-500' },
    { name: 'Hardware', icon: FaTags, color: 'bg-gray-500' },
  ];

  const sliderImages = [
    {
      url: '/images/logo.jpg', // Logo from public folder
      title: 'Welcome to Gatangu Enterprise',
      subtitle: 'Your trusted partner for quality products and excellent service',
      cta: 'Shop Now',
      ctaLink: '/shop'
    },
    {
      url: sliderImage, // slider.jpg from assets
      title: 'Shop Online & Get Free Delivery',
      subtitle: 'Spend Kes 2,000 or more and get your items delivered free within 5km',
      cta: 'Order Now',
      ctaLink: '/shop'
    },
    {
      url: slider1Image, // slider1.jpg from assets
      title: 'Visit Our Gatangu Mini Mart',
      subtitle: 'Fresh produce, gas cylinders, and household essentials at Kamune Shopping Center',
      cta: 'Find Location',
      ctaLink: '/shop'
    },
    {
      url: slider2Image, // slider2.png from assets
      title: 'Quality Products In-Store',
      subtitle: 'Browse our fully stocked shelves for all your daily needs',
      cta: 'Browse Products',
      ctaLink: '/shop'
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true before the API call
      try {
        const response = await api.get('/products'); // Fetch all products
        const sortedProducts = response.data.reverse(); // Reverse the list for LIFO behavior
        setFeaturedProducts(sortedProducts); // Store all products instead of slicing
        setError(false);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false); // Set loading to false after API call completes
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? featuredProducts 
    : featuredProducts.filter(product => 
        product.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-backgroundLight">
      {/* Adjust top padding to account for new navbar height */}
      <div className="pt-32 md:pt-36 pb-28 md:pb-8">
        
        {/* Hero Slider Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <HeroSlider slides={sliderImages} />
          </div>
        </motion.div>

        {/* Categories Section */}
        <motion.div 
          className="mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-secondary-800 flex items-center">
                <FaTags className="mr-3 text-primary-500" />
                Shop by Category
              </h2>
            </div>
            
            {/* Category Chips - Horizontal Scroll */}
            <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.name;
                
                return (
                  <motion.button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-medium'
                        : 'bg-white text-secondary-700 hover:bg-primary-50 border border-secondary-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <IconComponent className="text-sm" />
                    <span className="text-sm">{category.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Featured Products Section */}
        <motion.div 
          className="mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-secondary-800 flex items-center">
                <FaFire className="mr-3 text-accent-500" />
                {selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory} Products`}
              </h2>
              <Link 
                to="/products" 
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm"
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </Link>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-secondary-200 rounded-2xl aspect-square mb-4"></div>
                    <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                    <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-error text-lg mb-4">Failed to fetch products</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedCategory}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      className="col-span-full text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-secondary-500 text-lg mb-4">
                        No products found in {selectedCategory}
                      </div>
                      <button 
                        onClick={() => setSelectedCategory('All')}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View All Products
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Quick Stats or Features Section */}
        <motion.div 
          className="bg-white py-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: FaShoppingBag, title: '1000+', subtitle: 'Products' },
                { icon: FaTags, title: '50+', subtitle: 'Categories' },
                { icon: FaFire, title: '24/7', subtitle: 'Support' },
                { icon: FaChevronRight, title: 'Fast', subtitle: 'Delivery' },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center p-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="text-primary-600 text-lg" />
                    </div>
                    <div className="text-lg font-bold text-secondary-800">{stat.title}</div>
                    <div className="text-sm text-secondary-500">{stat.subtitle}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
