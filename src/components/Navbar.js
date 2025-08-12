import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const ADMIN_ID = '674e4b8c22fc2df1f90d95ae';

  const productList = [
    'Fresh Milk',
    'Broadway Bread 200 gm',
    'Tupike Maize Flour 2 kg',
    'Soko Wheat Flour 2 kg',
    'Ajab Wheat Flour 2 kg',
    'Garba Kangore Rice 25 kg',
    'Local Sugar 1 kg',
    'Green Peas 1 kg',
    'Apples',
    'Oranges',
    'Dhania',
    'Ginger',
    'Cabbages',
    'Courgettes',
    'Capsicum (Hoho)',
    'Garlic (Saumu)',
    'Onion',
    'Tomatoes (Nyanya - Kilo)',
    'Potatoes (Waru) - 2 kg',
    'Potatoes (Waru) - Bucket',
    'Coopers Milking Salve 100 gm',
    'Arimis Milking Jelly 200 gm',
    'Body Luxe Aloe Vera 50 ml',
    'Softcare Pads',
    'Softcare Diapers HC S48',
    'Softcare Diapers M12',
    'Softcare Diapers XL10',
    'Kasuku Cooking Fat 1 kg',
    'Rina Vegetable Oil 5 Ltr',
    'Salit Salad Oil 10 Ltr',
    'Salit Salad Oil 1 Ltr',
    'Sunveat Glucose Champ Biscuits 48\'s',
    'Nuvita Biscuits 60\'s',
    'Meta Bar Soap 1 kg',
    'Menengai Bar Soap 1 kg',
    'Ushindi Multipurpose Bar Soap 1 kg',
    'Toilex Tissue',
    'Tricycle Padlocks #266',
    'Golden Lion Battery - Pair',
    'Sumo Candle (8 pcs)',
    'Indomie',
    'Ranee Spaghetti 400 gm',
    'Raha Drinking Chocolate 100 gm',
    'Kasuku E/Books A5 120 pgs',
    'Kasuku E/Books A5 80 pgs',
    'Zesta Red Plum Jam 200 gm'
  ]; // Fetch from API for dynamic updates.
   // Replace with dynamic data from your backend/API if available.

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Dynamic filtering
    if (query.trim()) {
      const filteredSuggestions = productList.filter((product) =>
        product.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const toggleAccountDropdown = () => {
    setAccountDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setAccountDropdownOpen(false);
  };

  return (
    <>
      {/* Top Contact Bar - Desktop Only */}
      <div className="hidden md:block bg-secondary-800 text-secondary-100">
        <div className="container mx-auto flex justify-end items-center py-2 text-sm">
          <span>0724-526-080</span>
          <span className="mx-4">|</span>
          <span>0722-260-860</span>
        </div>
      </div>

      {/* Main Header */}
      <motion.header 
        className="bg-white/95 backdrop-blur-sm border-b border-secondary-200 fixed top-0 left-0 w-full z-50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <FaBars className="text-secondary-600 text-lg" />
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center"
            >
              <motion.img
                src="/images/logo.jpg"
                alt="Gatangu Logo"
                className="w-10 h-10 md:w-16 md:h-16 rounded-xl object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
              <div className="ml-3 hidden md:block">
                <h1 className="text-lg font-bold text-secondary-800">Gatangu</h1>
                <p className="text-xs text-secondary-500">Enterprise</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden md:flex flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-secondary-200 text-secondary-800 text-sm bg-secondary-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 p-1 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <FaSearch className="text-secondary-500 hover:text-primary-600" />
                </button>
                
                {/* Search Suggestions */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.ul
                      className="absolute top-full left-0 w-full bg-white border border-secondary-200 rounded-xl mt-2 shadow-medium z-50 max-h-64 overflow-y-auto"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {suggestions.map((item, index) => (
                        <motion.li
                          key={index}
                          className="px-4 py-3 hover:bg-secondary-50 cursor-pointer text-secondary-800 border-b border-secondary-100 last:border-b-0"
                          whileHover={{ backgroundColor: '#f8fafc' }}
                          onClick={() => {
                            setSearchQuery(item);
                            setSuggestions([]);
                            navigate(`/search?q=${item}`);
                          }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-6">
              {user && (
                <div className="relative">
                  <motion.button
                    onClick={toggleAccountDropdown}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-secondary-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaUser className="text-secondary-600" />
                    <span className="text-secondary-800 font-medium">Hi, {user.username}</span>
                  </motion.button>
                  
                  <AnimatePresence>
                    {accountDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 bg-white border border-secondary-200 rounded-xl shadow-medium z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="block px-4 py-3 text-secondary-800 hover:bg-secondary-50 transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-3 text-secondary-800 hover:bg-secondary-50 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {!user && (
                <>
                  <Link 
                    to="/login" 
                    className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
              
              <Link 
                to="/cart" 
                className="relative p-2 rounded-lg hover:bg-secondary-100 transition-colors group"
              >
                <FaShoppingCart className="text-secondary-600 group-hover:text-primary-600 text-lg" />
                {cart.length > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {cart.length > 9 ? '9+' : cart.length}
                  </motion.span>
                )}
              </Link>
              
              {user?.id === ADMIN_ID && (
                <Link
                  to="/admin-panel"
                  className="bg-secondary-800 hover:bg-secondary-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Mobile Search & Cart */}
            <div className="flex md:hidden items-center space-x-3">
              <Link 
                to="/cart" 
                className="relative p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <FaShoppingCart className="text-secondary-600 text-lg" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold">
                    {cart.length > 9 ? '9+' : cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-secondary-200 text-secondary-800 text-sm bg-secondary-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 p-1 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <FaSearch className="text-secondary-500" />
              </button>
              
              {/* Mobile Search Suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.ul
                    className="absolute top-full left-0 w-full bg-white border border-secondary-200 rounded-xl mt-2 shadow-medium z-50 max-h-64 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        className="px-4 py-3 hover:bg-secondary-50 cursor-pointer text-secondary-800 border-b border-secondary-100 last:border-b-0"
                        onClick={() => {
                          setSearchQuery(item);
                          setSuggestions([]);
                          navigate(`/search?q=${item}`);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </form>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay - Outside header to avoid z-index conflicts */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="md:hidden">
            <motion.div
              className="fixed inset-0 bg-black/60"
              style={{ 
                zIndex: 999999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
              style={{ 
                backgroundColor: '#ffffff',
                zIndex: 9999999,
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: '320px',
                maxWidth: '85vw',
                boxShadow: '0 0 50px rgba(0,0,0,0.3)',
                isolation: 'isolate'
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div 
                className="h-full w-full bg-white p-6 overflow-y-auto" 
                style={{ 
                  backgroundColor: '#ffffff',
                  opacity: 1,
                  width: '100%',
                  height: '100%',
                  isolation: 'isolate'
                }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <img
                      src="/images/logo.jpg"
                      alt="Gatangu Logo"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="ml-3">
                      <h2 className="text-lg font-bold text-secondary-800">Gatangu</h2>
                      <p className="text-sm text-secondary-500">Enterprise</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-red-100 transition-colors border border-secondary-200 hover:border-red-300"
                  >
                    <FaTimes className="text-secondary-600 hover:text-red-600" />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 rounded-lg text-secondary-800 hover:bg-secondary-100 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-secondary-200">
                        <p className="text-secondary-800 font-medium">Hi, {user.username}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 rounded-lg text-secondary-800 hover:bg-secondary-100 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      {user?.id === ADMIN_ID && (
                        <Link
                          to="/admin-panel"
                          className="block px-4 py-3 rounded-lg text-secondary-800 hover:bg-secondary-100 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
