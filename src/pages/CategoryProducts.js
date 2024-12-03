import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from '../services/api';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products by category from the backend
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get('/products'); // Fetch all products
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

  return (
    <div
      className="container mx-auto py-10"
      style={{
        fontFamily: `'Roboto', 'Roboto Condensed', 'Roboto Slab', sans-serif`,
        backgroundColor: '#f1f1f1', // Light grey background
        paddingTop: '200px', // Spacing for fixed navbar
        paddingBottom: '100px', // Spacing for footer
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
            Products in "{categoryName}"
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 md:px-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No products found in this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
