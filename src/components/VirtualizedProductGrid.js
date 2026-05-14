import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const VirtualizedProductGrid = ({ products, viewMode = 'grid' }) => {
  const [visibleItems, setVisibleItems] = useState(20); // Show 20 items initially
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Memoize the visible products to avoid recalculation
  const displayedProducts = useMemo(() => {
    return products.slice(0, visibleItems);
  }, [products, visibleItems]);

  // Load more items when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1000 >=
        document.documentElement.offsetHeight
      ) {
        loadMoreItems();
      }
    };

    const throttledScrollHandler = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledScrollHandler);
    
    return () => window.removeEventListener('scroll', throttledScrollHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleItems, products.length]);

  const loadMoreItems = () => {
    if (visibleItems >= products.length || isLoadingMore) return;

    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 12, products.length));
      setIsLoadingMore(false);
    }, 300);
  };

  // Throttle function
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  return (
    <>
      {/* Products Grid */}
      <div className={`grid gap-4 md:gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}>
        {displayedProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
            className={viewMode === 'list' ? 'max-w-none' : ''}
          >
            {viewMode === 'grid' ? (
              <ProductCard product={product} />
            ) : (
              <div className="bg-white rounded-2xl shadow-soft p-6 flex items-center space-x-6">
                <div className="w-24 h-24 bg-secondary-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-800 mb-1">{product.name}</h3>
                  <p className="text-secondary-500 text-sm mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">
                      {new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: 'KES',
                        minimumFractionDigits: 0,
                      }).format(product.price)}
                    </span>
                    <motion.button
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Load More Indicator */}
      {visibleItems < products.length && (
        <div className="text-center mt-8">
          {isLoadingMore ? (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-secondary-600">Loading more products...</span>
            </div>
          ) : (
            <motion.button
              onClick={loadMoreItems}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Load More ({products.length - visibleItems} remaining)
            </motion.button>
          )}
        </div>
      )}

      {/* Scroll to Top Button */}
      {visibleItems > 20 && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg z-30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ↑
        </motion.button>
      )}
    </>
  );
};

export default VirtualizedProductGrid;