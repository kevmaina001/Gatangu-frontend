import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaThLarge, 
  FaShoppingCart, 
  FaUser,
  FaUserCircle 
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: FaHome,
      label: 'Home'
    },
    {
      name: 'Shop',
      path: '/shop',
      icon: FaThLarge,
      label: 'Shop'
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: FaShoppingCart,
      label: 'Cart',
      badge: cart.length > 0 ? cart.length : null
    },
    {
      name: 'Account',
      path: user ? '/profile' : '/login',
      icon: user ? FaUserCircle : FaUser,
      label: user ? 'Profile' : 'Login'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = isActivePath(item.path);
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1"
            >
              <motion.div
                className="relative flex flex-col items-center"
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {/* Icon Container */}
                <div className={`relative p-2 rounded-full ${
                  isActive 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-secondary-500'
                }`}>
                  <IconComponent 
                    className={`text-lg ${
                      isActive ? 'text-primary-600' : 'text-secondary-500'
                    }`} 
                  />
                  
                  {/* Badge for cart */}
                  {item.badge && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.div>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium mt-1 ${
                  isActive 
                    ? 'text-primary-600' 
                    : 'text-secondary-500'
                }`}>
                  {item.label}
                </span>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 w-1 h-1 bg-primary-500 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-bottom bg-white" />
    </motion.nav>
  );
};

export default BottomNavigation;