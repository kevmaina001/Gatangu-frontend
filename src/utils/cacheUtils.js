const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEYS = {
  PRODUCTS: 'gatangu_products',
  CATEGORY_PRODUCTS: 'gatangu_category_products'
};

class CacheManager {
  // Set data in cache with timestamp
  static set(key, data, customDuration = CACHE_DURATION) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        duration: customDuration
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
      return true;
    } catch (error) {
      console.warn('Failed to cache data:', error);
      return false;
    }
  }

  // Get data from cache if still valid
  static get(key) {
    try {
      const cachedItem = localStorage.getItem(key);
      if (!cachedItem) return null;

      const { data, timestamp, duration } = JSON.parse(cachedItem);
      const now = Date.now();

      // Check if cache is still valid
      if (now - timestamp > duration) {
        this.remove(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      this.remove(key);
      return null;
    }
  }

  // Remove specific cache entry
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove cache entry:', error);
    }
  }

  // Clear all cache entries for the app
  static clearAll() {
    try {
      Object.values(CACHE_KEYS).forEach(key => {
        this.remove(key);
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  // Check if cache exists and is valid
  static isValid(key) {
    const data = this.get(key);
    return data !== null;
  }

  // Get cache age in minutes
  static getCacheAge(key) {
    try {
      const cachedItem = localStorage.getItem(key);
      if (!cachedItem) return -1;

      const { timestamp } = JSON.parse(cachedItem);
      return Math.floor((Date.now() - timestamp) / 60000); // Age in minutes
    } catch (error) {
      return -1;
    }
  }
}

// Product-specific cache helpers
export const ProductCache = {
  // Cache all products
  setProducts: (products) => {
    return CacheManager.set(CACHE_KEYS.PRODUCTS, products);
  },

  // Get cached products
  getProducts: () => {
    return CacheManager.get(CACHE_KEYS.PRODUCTS);
  },

  // Cache products for a specific category
  setCategoryProducts: (category, products) => {
    const key = `${CACHE_KEYS.CATEGORY_PRODUCTS}_${category.toLowerCase()}`;
    return CacheManager.set(key, products);
  },

  // Get cached products for a specific category
  getCategoryProducts: (category) => {
    const key = `${CACHE_KEYS.CATEGORY_PRODUCTS}_${category.toLowerCase()}`;
    return CacheManager.get(key);
  },

  // Clear all product caches
  clearAll: () => {
    CacheManager.clearAll();
  },

  // Check if products cache is fresh (less than 2 minutes old)
  isProductsCacheFresh: () => {
    const age = CacheManager.getCacheAge(CACHE_KEYS.PRODUCTS);
    return age !== -1 && age < 2;
  }
};

export default CacheManager;