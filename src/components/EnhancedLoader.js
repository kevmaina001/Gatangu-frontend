import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBag, FaWifi, FaClock } from 'react-icons/fa';

const EnhancedLoader = ({ 
  isLoading = true, 
  hasError = false, 
  onRetry, 
  showCachedData = false,
  errorMessage = null,
  loadingText = "Loading products..."
}) => {
  const [loadingStage, setLoadingStage] = useState(0);
  const [showSlowConnectionTip, setShowSlowConnectionTip] = useState(false);

  const loadingStages = [
    { text: loadingText, icon: FaShoppingBag, delay: 0 },
    { text: "Getting fresh products for you...", icon: FaShoppingBag, delay: 5000 },
    { text: "Taking longer than usual...", icon: FaClock, delay: 10000 },
    { text: "Still working on it...", icon: FaWifi, delay: 15000 },
  ];

  useEffect(() => {
    if (!isLoading) {
      setLoadingStage(0);
      setShowSlowConnectionTip(false);
      return;
    }

    const timers = [];

    loadingStages.forEach((stage, index) => {
      if (index === 0) return; // Skip first stage, it's immediate

      const timer = setTimeout(() => {
        setLoadingStage(index);
        if (index >= 2) {
          setShowSlowConnectionTip(true);
        }
      }, stage.delay);

      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [isLoading]);

  if (hasError) {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-medium p-8 md:p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
          <FaWifi className="text-orange-500 text-2xl" />
        </div>
        
        <h3 className="text-xl font-semibold text-secondary-700 mb-2">
          Having Trouble Connecting
        </h3>
        
        <p className="text-secondary-600 mb-6 max-w-md mx-auto">
          {showCachedData 
            ? "Don't worry! We're showing you the latest products while we reconnect."
            : errorMessage || "We're having trouble reaching our servers. This might be due to a slow connection or temporary server issue."
          }
        </p>

        {showSlowConnectionTip && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <FaWifi className="mr-2" />
              Connection Tips
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Check your internet connection</li>
              <li>• Try refreshing the page</li>
              <li>• Switch to a different network if available</li>
            </ul>
          </motion.div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            onClick={onRetry}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
          
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-secondary-100 hover:bg-secondary-200 text-secondary-700 px-6 py-3 rounded-xl font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh Page
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!isLoading) return null;

  const currentStage = loadingStages[loadingStage];
  const IconComponent = currentStage.icon;

  return (
    <motion.div
      className="text-center py-12 md:py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Icon */}
      <motion.div
        className="w-20 h-20 mx-auto mb-6 relative"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent className="text-primary-600 text-xl" />
        </div>
      </motion.div>

      {/* Loading Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={loadingStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-secondary-700 mb-2">
            {currentStage.text}
          </h3>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="flex justify-center space-x-2 mb-4">
        {loadingStages.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index <= loadingStage ? 'bg-primary-500 w-8' : 'bg-secondary-200 w-4'
            }`}
            initial={{ width: 16 }}
            animate={{ width: index <= loadingStage ? 32 : 16 }}
          />
        ))}
      </div>

      {/* Stage-specific messages */}
      <AnimatePresence>
        {loadingStage === 0 && (
          <motion.p
            className="text-secondary-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Getting the best deals ready for you
          </motion.p>
        )}
        
        {loadingStage === 1 && (
          <motion.p
            className="text-secondary-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Ensuring you get the freshest products
          </motion.p>
        )}
        
        {loadingStage >= 2 && (
          <motion.div
            className="text-secondary-500 text-sm space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p>Your connection might be slow, but we're still working!</p>
            {showCachedData && (
              <p className="text-blue-600 font-medium">
                💡 Showing cached results to keep you shopping
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedLoader;