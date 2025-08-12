// src/pages/SearchResults.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaSort, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products');
        const filteredResults = response.data.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        
        // Apply sorting
        let sortedResults = [...filteredResults];
        switch (sortBy) {
          case 'price-low':
            sortedResults.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            sortedResults.sort((a, b) => b.price - a.price);
            break;
          case 'name':
            sortedResults.sort((a, b) => a.name.localeCompare(b.name));
            break;
          default:
            // relevance - keep original order
            break;
        }
        
        setSearchResults(sortedResults);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearchResults();
  }, [query, sortBy]);

  return (
    <div className="min-h-screen bg-backgroundLight pt-32 pb-28 md:pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Home</span>
          </Link>

          {/* Search Header */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
              <FaSearch className="text-primary-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-secondary-800">
                Search Results
              </h1>
              <p className="text-secondary-600">
                {query ? `Showing results for "${query}"` : 'Search results'}
              </p>
            </div>
          </div>

          {/* Results Count & Controls */}
          {!loading && !error && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white rounded-xl shadow-soft border border-secondary-100">
              <div className="flex items-center">
                <span className="text-secondary-600">
                  Found <span className="font-semibold text-secondary-800">{searchResults.length}</span> product{searchResults.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <FaSort className="text-secondary-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-secondary-200 rounded-lg px-3 py-2 text-secondary-700 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-secondary-700 mb-2">
              Searching Products...
            </h3>
            <p className="text-secondary-500">
              Please wait while we find the best results for you
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-700 mb-2">
              Search Error
            </h3>
            <p className="text-red-500 mb-6">{error}</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : searchResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
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
              We couldn't find any products matching "{query}". Try adjusting your search terms or browse our categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.history.back()}
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go Back
              </motion.button>
              <Link
                to="/"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-block text-center"
              >
                Browse All Products
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
