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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const categories = [
    'Groceries',
    'Personal Care',
    'Household Supplies',
    'Snacks & Beverages',
    'Baby Products',
    'Health & Wellness',
  ];

  const sliderImages = [
    '/images/placeholder.jpg',
    '/images/placeholder1.jpg',
    '/images/placeholder2.jpg',
    '/images/placeholder3.jpg',
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setFeaturedProducts(response.data.slice(0, 8));
        setError(false);
      } catch (error) {
        setError(true);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      className="container mx-auto py-10 font-roboto bg-white"
      style={{
        paddingTop: '200px', // Adjust this value based on your navbar height
        paddingBottom: '200px'
      }}
    >
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden bg-yellow-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? 'Close Categories' : 'Open Categories'}
      </button>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-gray-100 transform ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform md:static md:translate-x-0 w-3/4 md:w-1/4 p-4 z-50`}
          style={{
            zIndex: 10, // Ensure the sidebar is above the slider
          }}
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

        {/* Overlay for Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
            style={{
              zIndex: 999, // Ensure overlay is below the sidebar
            }}
          ></div>
        )}

        {/* Main Content */}
        <main className="w-full md:w-3/4 md:ml-auto">
          {/* Image Slider */}
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
        </main>
      </div>

      {/* Featured Products Section */}
      <div className="my-8 px-4 md:px-12">
        <h2 className="text-xl font-bold mb-6 text-gray-800 font-roboto-slab">Featured Products</h2>
        {error ? (
          <p className="text-red-500">Failed to fetch products. Please try again.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
