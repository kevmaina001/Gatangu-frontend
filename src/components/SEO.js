import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "Gatangu - Fresh Products Delivered to Your Doorstep",
  description = "Shop fresh groceries, personal care, and household items at Gatangu. Fast delivery, competitive prices, and quality products for your daily needs in Kenya.",
  keywords = "gatangu, groceries, fresh products, delivery, kenya, shopping, household items, personal care, fast delivery",
  image = "/images/gatangu-og-image.jpg",
  url = window.location.href,
  type = "website",
  product = null,
  category = null,
  price = null,
  availability = null,
  brand = "Gatangu",
  locale = "en_KE",
  siteName = "Gatangu"
}) => {
  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${window.location.origin}/#organization`,
          "name": "Gatangu",
          "url": window.location.origin,
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/images/logo.png`,
            "width": 200,
            "height": 60
          },
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
        },
        {
          "@type": "WebSite",
          "@id": `${window.location.origin}/#website`,
          "url": window.location.origin,
          "name": "Gatangu",
          "publisher": {
            "@id": `${window.location.origin}/#organization`
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }
      ]
    };

    // Add product-specific structured data
    if (product) {
      const productData = {
        "@type": "Product",
        "@id": `${window.location.origin}/products/${product._id}`,
        "name": product.name,
        "description": product.description || description,
        "image": image,
        "brand": {
          "@type": "Brand",
          "name": brand
        },
        "category": product.category,
        "sku": product._id,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "KES",
          "availability": availability || (product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"),
          "seller": {
            "@id": `${window.location.origin}/#organization`
          },
          "url": url
        }
      };

      if (product.originalPrice && product.originalPrice > product.price) {
        productData.offers.priceSpecification = {
          "@type": "PriceSpecification",
          "price": product.originalPrice,
          "priceCurrency": "KES"
        };
      }

      baseData["@graph"].push(productData);
    }

    // Add category page structured data
    if (category) {
      baseData["@graph"].push({
        "@type": "CollectionPage",
        "@id": url,
        "name": `${category} - Gatangu`,
        "description": `Shop ${category.toLowerCase()} products at Gatangu. Fresh, quality items with fast delivery.`,
        "url": url,
        "mainEntity": {
          "@type": "ItemList",
          "name": `${category} Products`,
          "description": `Collection of ${category.toLowerCase()} products available at Gatangu`
        }
      });
    }

    return baseData;
  };

  // Generate canonical URL
  const canonicalUrl = url.split('?')[0].split('#')[0];

  // Generate title with proper length (50-60 characters)
  const optimizedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;

  // Generate description with proper length (150-160 characters)
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Gatangu" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Product-specific Open Graph */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content="KES" />
          <meta property="product:availability" content={product.stock > 0 ? "instock" : "oos"} />
          <meta property="product:condition" content="new" />
          <meta property="product:brand" content={brand} />
          <meta property="product:category" content={product.category} />
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@gatangu" />
      <meta name="twitter:creator" content="@gatangu" />

      {/* Product-specific Twitter */}
      {product && (
        <>
          <meta name="twitter:label1" content="Price" />
          <meta name="twitter:data1" content={`KES ${product.price}`} />
          <meta name="twitter:label2" content="Availability" />
          <meta name="twitter:data2" content={product.stock > 0 ? "In Stock" : "Out of Stock"} />
        </>
      )}

      {/* Mobile and Responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />

      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme and App Configuration */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="application-name" content="Gatangu" />
      <meta name="apple-mobile-web-app-title" content="Gatangu" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Geographic and Language */}
      <meta name="geo.region" content="KE" />
      <meta name="geo.country" content="Kenya" />
      <meta name="language" content="English" />
      <meta name="content-language" content="en-ke" />

      {/* E-commerce specific */}
      {product && (
        <>
          <meta name="product" content={product.name} />
          <meta name="price" content={`KES ${product.price}`} />
          <meta name="currency" content="KES" />
        </>
      )}

      {/* AI Search Optimization */}
      <meta name="AI:title" content={optimizedTitle} />
      <meta name="AI:description" content={optimizedDescription} />
      <meta name="AI:image" content={image} />
      <meta name="AI:type" content={type} />
      
      {/* Business Information for AI */}
      <meta name="business:type" content="E-commerce" />
      <meta name="business:country" content="Kenya" />
      <meta name="business:category" content="Grocery Delivery" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData(), null, 2)}
      </script>

      {/* Additional SEO Enhancements */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="1 days" />
      
      {/* Performance and Loading */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Security */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Helmet>
  );
};

export default SEO;