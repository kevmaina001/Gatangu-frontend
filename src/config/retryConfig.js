// Retry configuration for different types of requests

export const RETRY_CONFIGS = {
  // Product fetching (high priority, frequent retries)
  PRODUCTS: {
    maxRetries: 5,
    retryDelays: [1000, 3000, 5000, 8000, 12000], // Progressive delays
    shouldRetry: (error) => {
      return (
        error.code === 'ECONNABORTED' ||
        error.code === 'NETWORK_ERROR' ||
        !error.response ||
        (error.response?.status >= 500 && error.response?.status < 600) ||
        error.response?.status === 408 || // Request timeout
        error.response?.status === 429    // Too many requests
      );
    },
    enableAutoRetry: true,
    description: 'Configuration for product data fetching with aggressive retry policy'
  },

  // Category products (similar to products but slightly less aggressive)
  CATEGORY_PRODUCTS: {
    maxRetries: 4,
    retryDelays: [1500, 4000, 7000, 12000],
    shouldRetry: (error) => {
      return (
        error.code === 'ECONNABORTED' ||
        error.code === 'NETWORK_ERROR' ||
        !error.response ||
        (error.response?.status >= 500 && error.response?.status < 600) ||
        error.response?.status === 408 ||
        error.response?.status === 429
      );
    },
    enableAutoRetry: true,
    description: 'Configuration for category-specific product fetching'
  },

  // Search requests (moderate retry policy)
  SEARCH: {
    maxRetries: 3,
    retryDelays: [2000, 5000, 10000],
    shouldRetry: (error) => {
      return (
        error.code === 'ECONNABORTED' ||
        error.code === 'NETWORK_ERROR' ||
        !error.response ||
        (error.response?.status >= 500 && error.response?.status < 600)
      );
    },
    enableAutoRetry: true,
    description: 'Configuration for search functionality with moderate retry policy'
  },

  // User actions (cart, profile, etc.) - conservative retry policy
  USER_ACTIONS: {
    maxRetries: 2,
    retryDelays: [3000, 8000],
    shouldRetry: (error) => {
      // Don't retry client errors (4xx) for user actions
      return (
        error.code === 'ECONNABORTED' ||
        error.code === 'NETWORK_ERROR' ||
        !error.response ||
        (error.response?.status >= 500 && error.response?.status < 600)
      );
    },
    enableAutoRetry: false, // Let user decide when to retry
    description: 'Conservative retry policy for user-initiated actions'
  },

  // Critical operations (orders, payments) - manual retry only
  CRITICAL: {
    maxRetries: 1,
    retryDelays: [5000],
    shouldRetry: (error) => {
      // Only retry network-level errors, not HTTP errors
      return (
        error.code === 'ECONNABORTED' ||
        error.code === 'NETWORK_ERROR' ||
        !error.response
      );
    },
    enableAutoRetry: false,
    description: 'Manual retry only for critical operations like payments'
  }
};

// Helper function to get retry config by type
export const getRetryConfig = (type) => {
  const config = RETRY_CONFIGS[type];
  if (!config) {
    console.warn(`Unknown retry config type: ${type}. Using default PRODUCTS config.`);
    return RETRY_CONFIGS.PRODUCTS;
  }
  return config;
};

// Default configuration for backward compatibility
export const DEFAULT_RETRY_CONFIG = RETRY_CONFIGS.PRODUCTS;

// Connection quality detection
export const detectConnectionQuality = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    return 'unknown';
  }

  const effectiveType = connection.effectiveType;
  const downlink = connection.downlink;

  if (effectiveType === 'slow-2g' || downlink < 0.5) {
    return 'slow';
  } else if (effectiveType === '2g' || downlink < 1.5) {
    return 'moderate';
  } else if (effectiveType === '3g' || downlink < 5) {
    return 'good';
  } else {
    return 'fast';
  }
};

// Adaptive retry configuration based on connection quality
export const getAdaptiveRetryConfig = (baseType, connectionQuality = null) => {
  const baseConfig = getRetryConfig(baseType);
  const quality = connectionQuality || detectConnectionQuality();
  
  switch (quality) {
    case 'slow':
      return {
        ...baseConfig,
        maxRetries: Math.min(baseConfig.maxRetries + 2, 8), // More retries
        retryDelays: baseConfig.retryDelays.map(delay => delay * 1.5), // Longer delays
        description: `${baseConfig.description} - Adapted for slow connection`
      };
      
    case 'moderate':
      return {
        ...baseConfig,
        maxRetries: baseConfig.maxRetries + 1, // One extra retry
        retryDelays: baseConfig.retryDelays.map(delay => delay * 1.2), // Slightly longer delays
        description: `${baseConfig.description} - Adapted for moderate connection`
      };
      
    case 'fast':
      return {
        ...baseConfig,
        retryDelays: baseConfig.retryDelays.map(delay => Math.max(delay * 0.7, 500)), // Shorter delays
        description: `${baseConfig.description} - Adapted for fast connection`
      };
      
    default:
      return baseConfig;
  }
};

// Retry statistics tracking
export class RetryStats {
  constructor() {
    this.stats = {
      totalAttempts: 0,
      successfulRetries: 0,
      failedRetries: 0,
      averageRetryTime: 0,
      connectionQuality: detectConnectionQuality()
    };
  }

  recordAttempt(success, retryTime, attemptNumber) {
    this.stats.totalAttempts++;
    
    if (success && attemptNumber > 0) {
      this.stats.successfulRetries++;
      this.updateAverageRetryTime(retryTime);
    } else if (!success && attemptNumber > 0) {
      this.stats.failedRetries++;
    }
  }

  updateAverageRetryTime(newTime) {
    const totalSuccessful = this.stats.successfulRetries;
    this.stats.averageRetryTime = (
      (this.stats.averageRetryTime * (totalSuccessful - 1) + newTime) / totalSuccessful
    );
  }

  getStats() {
    return {
      ...this.stats,
      retrySuccessRate: this.stats.successfulRetries / (this.stats.successfulRetries + this.stats.failedRetries) * 100,
      connectionQuality: detectConnectionQuality()
    };
  }

  reset() {
    this.stats = {
      totalAttempts: 0,
      successfulRetries: 0,
      failedRetries: 0,
      averageRetryTime: 0,
      connectionQuality: detectConnectionQuality()
    };
  }
}

// Global retry statistics instance
export const globalRetryStats = new RetryStats();