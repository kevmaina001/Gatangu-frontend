// Utility functions for SEO optimization

export const generatePageTitle = (productName, category = '', isProduct = false) => {
  const baseTitle = "Gatangu";
  const suffix = "Online Shopping Kenya";
  
  if (isProduct && productName) {
    return `${productName} - Buy Online at ${baseTitle} | Best Price in Kenya`;
  }
  
  if (category) {
    return `${category} Products - ${baseTitle} | ${suffix}`;
  }
  
  return `${baseTitle} - Fresh Products Delivered to Your Doorstep | ${suffix}`;
};

export const generateMetaDescription = (productName, category = '', price = null, isProduct = false) => {
  if (isProduct && productName) {
    const priceText = price ? ` Price: KES ${price}.` : '';
    return `Buy ${productName} online at Gatangu.${priceText} Quality ${category || 'product'} with fast delivery across Kenya. Order now!`;
  }
  
  if (category) {
    return `Shop ${category.toLowerCase()} products at Gatangu. Quality items with fast delivery across Kenya. Best prices guaranteed.`;
  }
  
  return "Shop fresh groceries, personal care, and household items at Gatangu. Fast delivery across Kenya with competitive prices. Order online for convenient shopping experience.";
};

export const generateKeywords = (productName, category = '', isProduct = false) => {
  const baseKeywords = "gatangu, online shopping kenya, fast delivery kenya, e-commerce kenya";
  
  if (isProduct && productName) {
    return `${productName}, ${category}, buy online kenya, ${productName} price, gatangu products, ${baseKeywords}`;
  }
  
  if (category) {
    return `${category}, ${category} products, buy ${category} online kenya, gatangu ${category}, ${baseKeywords}`;
  }
  
  return `${baseKeywords}, fresh products delivery, household items kenya, groceries online`;
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateProductSchema = (product) => {
  if (!product) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `Quality ${product.category || 'product'} available at Gatangu`,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "Gatangu"
    },
    "category": product.category,
    "sku": product._id,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "KES",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Gatangu"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "100"
    }
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gatangu",
    "url": window.location.origin,
    "logo": `${window.location.origin}/images/logo.png`,
    "description": "Fresh products delivered to your doorstep in Kenya",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressLocality": "Kenya"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Swahili"]
    },
    "sameAs": [
      "https://facebook.com/gatanguenterprise",
      "https://twitter.com/gatanguenterprise", 
      "https://instagram.com/gatanguenterprise"
    ]
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gatangu",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
};

// URL optimization utilities
export const cleanURL = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

export const generateCanonicalURL = (path = '') => {
  const baseURL = process.env.REACT_APP_SITE_URL || window.location.origin;
  return `${baseURL}${path}`.replace(/\/$/, ''); // Remove trailing slash
};

// Social media optimization
export const generateOpenGraphImage = (productImage, productName) => {
  if (productImage) {
    return productImage;
  }
  
  // Fallback to default OG image
  return `${window.location.origin}/images/gatangu-og-default.jpg`;
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};