import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCaretDown,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const ADMIN_ID = '674e4b8c22fc2df1f90d95ae'; // Hardcoded Admin User ID

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleAccountDropdown = () => setAccountDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setAccountDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <header
      className="bg-gray-800 text-gray-100 fixed top-0 left-0 w-full z-50 shadow-lg"
      style={{ fontFamily: `'Roboto', sans-serif` }}
    >
      {/* Top Bar */}
      <div className="container mx-auto flex justify-end items-center py-2 text-sm">
        <span>0724-526-080</span>
        <span className="mx-4">|</span>
        <span>0722-260-860</span>
      </div>

      {/* Main Navbar */}
      <nav className="container mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-bold text-primary">
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="w-20 h-20 md:w-24 md:h-24 rounded-lg"
          />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none mx-4 max-w-[200px] md:max-w-[300px] flex-grow"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-black text-sm"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
          >
            <FaSearch />
          </button>
        </form>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Add Product Button (Admin Only) */}
          {user?.id === ADMIN_ID && (
            <Link
              to="/admin-panel"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              AdminPanel
            </Link>
          )}

          {/* Account Dropdown */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={toggleAccountDropdown}
                  className="flex items-center hover:text-primary"
                >
                  <FaUser className="mr-2" />
                  Hi, {user.username}
                  <FaCaretDown className="ml-1" />
                </button>
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-secondary rounded-md shadow-lg z-10">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex space-x-4">
              <Link to="/login" className="flex items-center hover:text-primary">
                <FaUser className="mr-2" />
                Sign In
              </Link>
              <Link to="/register" className="flex items-center hover:text-primary">
                <FaUser className="mr-2" />
                Register
              </Link>
            </div>
            
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center hover:text-primary">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white rounded-full px-2 text-xs font-bold">
                {cart.length}
              </span>
            )}
            <span className="ml-2">Cart</span>
          </Link>
        </div>

        {/* Mobile Navbar */}
        <div className="flex md:hidden items-center space-x-4">
          {/* Cart in Mobile Navbar */}
          <Link to="/cart" className="relative text-white">
            <FaShoppingCart className="text-lg" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white rounded-full px-2 text-xs font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Menu Toggle */}
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed top-0 left-0 h-full w-3/4 bg-white text-secondary shadow-lg z-50 p-6 overflow-y-auto">
            <button onClick={toggleMenu} className="text-secondary focus:outline-none mb-4">
              <FaTimes className="text-2xl" />
            </button>

            {/* Mobile Profile Link */}
            {user && (
              <Link
                to="/profile"
                onClick={toggleMenu}
                className="block px-4 py-2 mb-4 bg-gray-200 text-secondary rounded hover:bg-gray-300"
              >
                Profile
              </Link>
            )}

            {/* Login Link */}
            {!user && (
              <div className="space-y-2">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block px-4 py-2 bg-gray-200 text-secondary rounded hover:bg-gray-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block px-4 py-2 bg-gray-200 text-secondary rounded hover:bg-gray-300"
              >
                Register
              </Link>
            </div>
            
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
