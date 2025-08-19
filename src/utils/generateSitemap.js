import axios from '../services/api';
import { CATEGORY_DISPLAY } from './categories';

// Generate dynamic sitemap for the application
export const generateSitemap = async () => {
  const baseURL = process.env.REACT_APP_SITE_URL || 'https://gatangu.com';
  const currentDate = new Date().toISOString();
  
  // Static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: '',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: currentDate
    },
    {
      url: '/shop',
      changefreq: 'daily',
      priority: '0.9',
      lastmod: currentDate
    },
    {
      url: '/search',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    }
  ];

  // Category pages
  const categoryPages = CATEGORY_DISPLAY.map(category => ({
    url: `/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`,
    changefreq: 'daily',
    priority: '0.8',
    lastmod: currentDate
  }));

  let productPages = [];
  try {
    // Fetch all products for dynamic product pages
    const response = await axios.get('/products');
    productPages = response.data.map(product => ({
      url: `/products/${product._id}`,
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: product.updatedAt || currentDate,
      image: product.image ? `${baseURL}/images/products/${product.image}` : null
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Combine all pages
  const allPages = [...staticPages, ...categoryPages, ...productPages];

  // Generate XML sitemap
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${baseURL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.image ? `
    <image:image>
      <image:loc>${page.image}</image:loc>
      <image:title>Product Image</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemapXML;
};

// Generate sitemap index for large sites
export const generateSitemapIndex = () => {
  const baseURL = process.env.REACT_APP_SITE_URL || 'https://gatangu.com';
  const currentDate = new Date().toISOString();

  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseURL}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseURL}/sitemap-products.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseURL}/sitemap-categories.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndexXML;
};