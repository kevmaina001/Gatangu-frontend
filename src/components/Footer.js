import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaWhatsapp, FaLifeRing, FaList } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
  const { user, logout } = useContext(AuthContext);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const categories = [
    'Airtime',
    'Animal Feeds',
    'Animal Health',
    'Baby Hygiene',
    'Bakery',
    'Beverages',
    'Cereals & Ext.',
    'Cigarettes',
    'Confectionery',
    'Display Dept',
    'Farm Inputs',
    'Fats & Oils',
    'Flour & Rice',
    'Food Additives',
    'Groceries',
    'Hardware',
    'Household',
    'Lighters',
    'Lightings',
    'Medicine',
    'Milk',
    'Packaging',
    'Personal Care',
    'Spreads',
    'Stationery',
    'Warehouse',
    'Wholesale',
  ];

  const toggleAccountDropdown = () => {
    setAccountDropdownOpen((prev) => !prev);
    setSupportDropdownOpen(false);
  };

  const toggleSupportDropdown = () => {
    setSupportDropdownOpen((prev) => !prev);
    setAccountDropdownOpen(false);
  };

  const toggleCategories = () => {
    setCategoriesOpen((prev) => !prev);
    setAccountDropdownOpen(false);
    setSupportDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesOpen && !event.target.closest('#categoriesPanel')) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoriesOpen]);

  return (
    <footer className="bg-gray-300 text-gray-900 py-6 fixed bottom-0 w-full md:relative z-30">
      {/* Desktop Footer */}
      <div className="container mx-auto text-center hidden md:block">
        <p className="text-gray-600">
          &copy; 2024 Gatangu Enterprises. All rights reserved.
        </p>
      </div>

      {/* Mobile Footer Navigation */}
      <div className="flex justify-around md:hidden bg-gray-200 text-gray-800 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex flex-col items-center text-sm hover:text-blue-600 transition-all"
          aria-label="Home"
        >
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="w-10 h-10 mb-1 rounded-lg border border-gray-300"
          />
          <span></span>
        </Link>

        {/* Categories */}
        <div className="relative flex flex-col items-center text-sm">
          <button
            onClick={toggleCategories}
            className="hover:text-blue-600 transition-all"
            aria-expanded={categoriesOpen}
            aria-label="Categories"
          >
            <FaList className="text-lg mb-1" />
            <span>Categories</span>
          </button>
        </div>

        {/* Account */}
        <div className="relative flex flex-col items-center text-sm">
          <button
            onClick={toggleAccountDropdown}
            className="hover:text-blue-600 transition-all"
            aria-expanded={accountDropdownOpen}
            aria-label="Account Menu"
          >
            <FaUser className="text-lg mb-1" />
            <span>{user ? user.username : 'Account'}</span>
          </button>
          {accountDropdownOpen && (
            <div
              id="accountDropdown"
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 rounded-md shadow-lg w-40 z-40"
            >
              <ul className="py-2">
                {user ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-200"
                        onClick={() => setAccountDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setAccountDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="block px-4 py-2 hover:bg-gray-200"
                        onClick={() => setAccountDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block px-4 py-2 hover:bg-gray-200"
                        onClick={() => setAccountDropdownOpen(false)}
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Support */}
        <div className="relative flex flex-col items-center text-sm">
          <button
            onClick={toggleSupportDropdown}
            className="hover:text-blue-600 transition-all"
            aria-expanded={supportDropdownOpen}
            aria-label="Support Menu"
          >
            <FaLifeRing className="text-lg mb-1" />
            <span>Support</span>
          </button>
          {supportDropdownOpen && (
            <div
              id="supportDropdown"
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 rounded-md shadow-lg w-40 z-40"
            >
              <ul className="py-2">
                <li>
                  <a
                    href="https://wa.me/254724526080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Help
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/254708328905"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Developer
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Categories Side Panel */}
      {/* Categories Side Panel */}
      {/* Categories Side Panel */}
{categoriesOpen && (
  <div
    id="categoriesPanel"
    className="fixed inset-0 bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out pt-32"
  >
    <div className="p-6 relative flex flex-col h-full">
      {/* Top Close Button */}
      <button
        onClick={() => setCategoriesOpen(false)}
        className="absolute top-4 right-4 text-black text-2xl hover:text-red-500 transition-all"
        aria-label="Close Categories Panel"
      >
        &times;
      </button>

      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul className="space-y-2 flex-grow">
        {categories.map((category, index) => (
          <li key={index}>
            <Link
              to={`/category/${category}`}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded"
              onClick={() => setCategoriesOpen(false)}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom Cancel Button */}
      <button
        onClick={() => setCategoriesOpen(false)}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
        aria-label="Cancel"
      >
        Cancel
      </button>
    </div>
  </div>
)}



    </footer>
  );
};

export default Footer;
