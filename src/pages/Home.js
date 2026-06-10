import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import SEO from '../components/SEO';
import api from '../services/api';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaChevronRight, FaFire, FaTags, FaShoppingBag, FaPills, FaTools, FaBaby, FaAppleAlt, FaLightbulb, FaBreadSlice, FaOilCan, FaWineBottle, FaSeedling, FaClipboardList, FaCoffee, FaBoxOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CATEGORY_DISPLAY } from '../utils/categories';

// Import slider images from assets
import sliderImage from '../Assets/images/slider.jpg';
import slider1Image from '../Assets/images/slider1.jpg';
import slider2Image from '../Assets/images/slider2.png';

const getIconForCategory = (categoryName) => {
  switch (categoryName) {
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
    default: return FaTags;
  }
};

// Color lookup from the curated display list (falls back to primary)
const COLOR_BY_NAME = CATEGORY_DISPLAY.reduce((acc, cat) => {
  acc[cat.name] = cat.color;
  return acc;
}, {});

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Build the category list to render. Prefer live counts from the API;
  // fall back to the curated display list if that endpoint is unavailable.
  const buildCategories = (apiCategories) => {
    const source = apiCategories && apiCategories.length
      ? apiCategories
      : CATEGORY_DISPLAY.filter(c => c.name !== 'All').map(c => ({ name: c.name, count: null }));

    return source.map(cat => ({
      name: cat.name,
      count: cat.count,
      icon: getIconForCategory(cat.name),
      color: COLOR_BY_NAME[cat.name] || 'bg-primary-500',
    }));
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Only fetch featured products + category list — never the full catalog.
        const [featuredRes, categoriesRes] = await Promise.allSettled([
          api.get('/products', { params: { featured: true, limit: 10 } }),
          api.get('/products/categories'),
        ]);

        if (featuredRes.status === 'fulfilled') {
          setFeaturedProducts(featuredRes.value.data || []);
          setError(false);
        } else {
          setError(true);
        }

        const apiCategories =
          categoriesRes.status === 'fulfilled' ? categoriesRes.value.data : null;
        setCategories(buildCategories(apiCategories));
      } catch (err) {
        setError(true);
        setCategories(buildCategories(null));
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      <SEO
        title="Gatangu - Fresh Products Delivered to Your Doorstep | Online Grocery Shopping Kenya"
        description="Shop fresh groceries, personal care, and household items at Gatangu. Fast delivery across Kenya with competitive prices. Order online for convenient shopping experience."
        keywords="gatangu, online grocery shopping kenya, fresh products delivery, household items kenya, groceries online, fast delivery kenya, e-commerce kenya"
        type="website"
        image={`${window.location.origin}/images/gatangu-home-og.jpg`}
        url={window.location.href}
      />
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

        {/* Categories Section — primary landing content */}
        <motion.div
          className="mb-12"
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
              <Link
                to="/shop"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm"
              >
                Browse All <FaChevronRight className="ml-1 text-xs" />
              </Link>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                  >
                    <Link
                      to={`/category/${encodeURIComponent(category.name)}`}
                      className="group flex flex-col items-center justify-center text-center p-4 bg-white rounded-2xl border border-secondary-100 shadow-soft hover:shadow-medium hover:border-primary-200 transition-all h-full"
                    >
                      <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-3 text-white group-hover:scale-105 transition-transform`}>
                        <IconComponent className="text-xl" />
                      </div>
                      <span className="text-sm font-semibold text-secondary-800 leading-tight">
                        {category.name}
                      </span>
                      {category.count != null && (
                        <span className="text-xs text-secondary-500 mt-1">
                          {category.count} item{category.count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </Link>
                  </motion.div>
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
                Featured Products
              </h2>
              <Link
                to="/shop"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm"
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </Link>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-secondary-200 rounded-2xl aspect-square mb-4"></div>
                    <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                    <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-error text-lg mb-4">Failed to load featured products</div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Featured Products Grid */}
            {!loading && !error && featuredProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty Featured State — prompt to browse categories */}
            {!loading && !error && featuredProducts.length === 0 && (
              <motion.div
                className="text-center py-10 bg-white rounded-2xl border border-secondary-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-secondary-600 mb-4">
                  Pick a category above to start shopping.
                </div>
                <Link
                  to="/shop"
                  className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Browse All Products
                </Link>
              </motion.div>
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
    </>
  );
};

export default Home;
