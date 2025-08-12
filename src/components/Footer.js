import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaWhatsapp,
  FaHeart
} from 'react-icons/fa';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const categories = [
    'Groceries',
    'Beverages', 
    'Personal Care',
    'Household',
    'Medicine',
    'Hardware',
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: FaWhatsapp, href: 'https://wa.me/254724526080', label: 'WhatsApp', color: 'hover:text-green-600' },
  ];

  return (
    <footer className="bg-secondary-800 text-white hidden md:block">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.jpg"
                alt="Gatangu Logo"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">Gatangu</h3>
                <p className="text-secondary-300 text-sm">Enterprise</p>
              </div>
            </div>
            <p className="text-secondary-300 text-sm leading-relaxed">
              Your trusted local store providing quality products for your daily needs. 
              Fresh, reliable, and always at your service.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-secondary-700 rounded-full flex items-center justify-center text-secondary-300 ${social.color} transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <IconComponent />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-secondary-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={`/category/${category}`}
                    className="text-secondary-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300">Gatangu Market, Kenya</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300">0724-526-080</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300">0722-260-860</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300">info@gatangu.co.ke</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-secondary-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-secondary-400 text-sm">
            &copy; 2024 Gatangu Enterprises. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-secondary-400 text-sm mt-2 md:mt-0">
            <span>Made with</span>
            <FaHeart className="text-red-500 text-xs" />
            <span>in Kenya</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
