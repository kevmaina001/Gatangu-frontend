// src/pages/SearchResults.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(useLocation().search).get('q'); // Get search query from URL

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await api.get('/products');
        const filteredResults = response.data.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Search Results for "{query}"</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No results found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchResults;
