import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCaretDown,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaTh,
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
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const ADMIN_ID = '674e4b8c22fc2df1f90d95ae'; // Hardcoded Admin User ID

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleAccountDropdown = () => setAccountDropdownOpen((prev) => !prev);
  const toggleCategories = () => setCategoriesOpen((prev) => !prev);

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
      className="bg-secondary text-white fixed top-0 left-0 w-full z-50 shadow-lg"
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
            className="w-16 h-16 md:w-20 md:h-20"
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
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={toggleCategories}
              className="flex items-center bg-gray-200 text-secondary px-3 py-2 rounded-md hover:bg-gray-300"
            >
              <FaTh className="mr-2" />
              Categories
            </button>
            {categoriesOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white text-secondary rounded-md shadow-lg z-10">
                <ul className="py-2">
                  <li>
                    <Link
                      to="/category/groceries"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={toggleCategories}
                    >
                      Groceries
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/personal-care"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={toggleCategories}
                    >
                      Personal Care
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/household-supplies"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={toggleCategories}
                    >
                      Household Supplies
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Add Product Button (Admin Only) */}
          {user?.id === ADMIN_ID && (
            <Link
              to="/add-product"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Add Product
            </Link>
          )}

          {/* Account Dropdown */}
          <div className="relative">
            {user ? (
              <button
                onClick={toggleAccountDropdown}
                className="flex items-center hover:text-primary"
              >
                <FaUser className="mr-2" />
                Hi, {user.username}
                <FaCaretDown className="ml-1" />
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleAccountDropdown}
                  className="flex items-center hover:text-primary"
                >
                  <FaUser className="mr-2" />
                  <FaCaretDown />
                </button>
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-secondary rounded-md shadow-lg z-10">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/login"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          Register
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
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

            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                <FaSearch />
              </button>
            </form>

            <ul className="space-y-4">
              <li>
                <Link
                  to="/category/groceries"
                  onClick={toggleMenu}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Groceries
                </Link>
              </li>
              <li>
                <Link
                  to="/category/personal-care"
                  onClick={toggleMenu}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Personal Care
                </Link>
              </li>
              <li>
                <Link
                  to="/category/household-supplies"
                  onClick={toggleMenu}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Household Supplies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
