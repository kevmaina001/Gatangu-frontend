import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import axios from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products'); // Fetch all products from the backend
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

  return (
    <div
      className="container mx-auto py-10"
      style={{
        fontFamily: `'Roboto', 'Roboto Condensed', 'Roboto Slab', sans-serif`,
        backgroundColor: '#ffffff', // Plain white background
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-lg">Loading products...</p>
        </div>
      ) : error ? (
        <div className="container mx-auto py-10 text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : (
        <div>
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{
              fontFamily: `'Roboto Slab', sans-serif`,
              fontSize: '2rem',
            }}
          >
            Our Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 md:px-12">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No products available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
