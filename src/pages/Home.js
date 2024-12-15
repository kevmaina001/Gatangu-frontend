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
    '/images/placeholder4.jpg',


  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setFeaturedProducts(response.data.slice(0, 13)); // Fetch the first 13 products
        setError(false);
      } catch (error) {
        setError(true);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      className="container mx-auto py-10 font-roboto"
      style={{
        backgroundColor: '#f1f1f1', // Light grey
        color: '#333', // Darker text for contrast
        paddingTop: '200px', // Adjust based on your navbar height
        paddingBottom: '100px', // Spacing for footer visibility
      }}
    >
      {/* Layout with Sidebar and Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar only visible on larger screens */}
        <aside
          className="md:h-full md:w-1/4 p-4 hidden md:block" // Hide on mobile and show on desktop
          style={{
            position: 'sticky',
            top: '0px', // Stick the sidebar to the top
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
        </main>
      </div>
    </div>
  );
};

export default Home;
