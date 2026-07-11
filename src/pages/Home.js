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
import { getOptimizedCloudinaryURL } from '../utils/imageUtils';

// Import slider images from assets
import sliderImage from '../Assets/images/slider.jpg';
import slider1Image from '../Assets/images/slider1.jpg';
import slider2Image from '../Assets/images/slider2.jpg';

// Number of latest products to surface in the rolling "Featured" queue.
const FEATURED_LIMIT = 20;

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

// Color lookup from the curated display list (fallback when no image exists)
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

  // Build the category list to render. Prefer live data (counts + image) from
  // the API; fall back to the curated display list if it's unavailable.
  const buildCategories = (apiCategories) => {
    const source = apiCategories && apiCategories.length
      ? apiCategories
      : CATEGORY_DISPLAY.filter(c => c.name !== 'All').map(c => ({ name: c.name, count: null, image: null }));

    return source.map(cat => ({
      name: cat.name,
      count: cat.count,
      image: cat.image || null,
      icon: getIconForCategory(cat.name),
      color: COLOR_BY_NAME[cat.name] || 'bg-primary-500',
    }));
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Latest products (rolling queue) + category list. Never the full catalog.
        const [featuredRes, categoriesRes] = await Promise.allSettled([
          api.get('/products', { params: { limit: FEATURED_LIMIT } }),
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

        {/* Categories Section — primary, full-width landing content */}
        <motion.div
          className="mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-secondary-800 flex items-center tracking-tight">
                  <FaTags className="mr-3 text-primary-500" />
                  Shop by Category
                </h2>
                <p className="text-secondary-500 mt-2 text-sm md:text-base">
                  Browse our full range — tap a category to see everything inside
                </p>
              </div>
              <Link
                to="/shop"
                className="hidden sm:flex text-primary-600 hover:text-primary-700 font-semibold items-center text-sm md:text-base whitespace-nowrap"
              >
                Browse All <FaChevronRight className="ml-1 text-xs" />
              </Link>
            </div>

            {/* Bold image-based category cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
                      className="group relative block rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all aspect-[4/3]"
                    >
                      {/* Representative image (latest item) or colored fallback */}
                      {category.image ? (
                        <img
                          src={getOptimizedCloudinaryURL(category.image, 600)}
                          alt={category.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`absolute inset-0 ${category.color} flex items-center justify-center`}>
                          <IconComponent className="text-white text-5xl opacity-80" />
                        </div>
                      )}

                      {/* Dark gradient for legible text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                      {/* Category icon badge */}
                      <div className={`absolute top-3 left-3 w-9 h-9 ${category.color} rounded-xl flex items-center justify-center text-white shadow-medium`}>
                        <IconComponent className="text-base" />
                      </div>

                      {/* Label */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                        <h3 className="text-white font-bold text-base md:text-xl leading-tight drop-shadow-md">
                          {category.name}
                        </h3>
                        {category.count != null && (
                          <p className="text-white/85 text-xs md:text-sm mt-0.5">
                            {category.count} item{category.count !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Featured Products Section — rolling queue of the latest items */}
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
                {[...Array(10)].map((_, index) => (
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
                <div className="text-error text-lg mb-4">Failed to load products</div>
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
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
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
              {(() => {
                // Real numbers from the live category data instead of made-up claims
                const productTotal = categories.reduce((sum, c) => sum + (c.count || 0), 0);
                return [
                  { icon: FaShoppingBag, title: productTotal ? `${productTotal}+` : 'Quality', subtitle: 'Products' },
                  { icon: FaTags, title: categories.length ? `${categories.length}` : 'Many', subtitle: 'Categories' },
                  { icon: FaFire, title: 'WhatsApp', subtitle: 'Ordering' },
                  { icon: FaChevronRight, title: 'Fast', subtitle: 'Delivery' },
                ];
              })().map((stat, index) => {
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
