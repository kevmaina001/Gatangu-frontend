import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/pagination';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const categories = [
    'Airtime',
    'Animal Feeds',
    'Animal Health',
    'Baby Hygiene',
    'Bakery',
    'Beverages',
    'Cereals & Ext.',
    'Cigarettes',
    'Confectionery',
    'Display Dept',
    'Farm Inputs',
    'Fats & Oils',
    'Flour & Rice',
    'Food Additives',
    'Groceries',
    'Hardware',
    'Household',
    'Lighters',
    'Lightings',
    'Medicine',
    'Milk',
    'Packaging',
    'Personal Care',
    'Spreads',
    'Stationery',
    'Warehouse',
    'Wholesale',
  ];

  const sliderImages = [
    '/images/logo.jpg',
    '/images/placeholder.jpg',
    '/images/placeholder1.jpg',
    '/images/logo.jpg',
    '/images/placeholder3.jpg',
    '/images/placeholder.jpg',
    '/images/placeholder6.jpg',
    '/images/placeholder4.jpg',
    '/images/placeholder7.jpg',
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

  return (
    <div
      className="container mx-auto font-['Poppins'] bg-gray-100 text-gray-800"
      style={{ paddingBottom: '100px' }}
    >
      <div className="py-36 md:py-48">
        {/* Layout with Sidebar and Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Sidebar only visible on larger screens */}
          <aside
            className="md:h-full md:w-1/4 p-4 hidden md:block"
            style={{ position: 'sticky', top: '0px' }}
          >
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <a href={`/category/${category}`} className="text-gray-700 hover:text-yellow-500 text-sm">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1 md:w-3/4">
            {/* Slider Section */}
            <div className="mb-8 mx-auto rounded-lg overflow-hidden" style={{ maxWidth: '90%' }}>
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                className="rounded-lg"
              >
                {sliderImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Slider ${index + 1}`}
                      className="w-full object-cover"
                      style={{ height: '40vw', maxHeight: '400px', minHeight: '250px' }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Featured Products Section */}
            <div className="my-8 px-4 md:px-12">
              <h2 className="text-xl font-bold mb-6 text-gray-800 font-roboto-slab">Featured Products</h2>
              {loading ? (
                <div className="text-center">
                  <p className="text-yellow-500 font-medium">Loading products...</p>
                </div>
              ) : error ? (
                <p className="text-red-500">Failed to fetch products. Please reload the page again.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
