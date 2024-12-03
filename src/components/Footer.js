import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaWhatsapp } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
  const { user, logout } = useContext(AuthContext); // Access user and logout function
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false); // Account dropdown state

  const toggleAccountDropdown = () => setAccountDropdownOpen(!accountDropdownOpen);

  return (
    <footer className="bg-secondary text-textPrimary py-4 fixed bottom-0 w-full md:relative">
      {/* Desktop Footer */}
      <div className="container mx-auto text-center hidden md:block">
        <p className="text-textSecondary">
          &copy; 2024 Gatangu Enterprises. All rights reserved.
        </p>
      </div>

      {/* Mobile Footer Navigation */}
      <div className="flex justify-around md:hidden bg-secondary text-white py-3">
        {/* Home */}
        <Link
          to="/"
          className="flex flex-col items-center text-sm hover:text-primary transition-all"
        >
          <FaHome className="text-lg mb-1" />
          <span>Home</span>
        </Link>

        {/* Account */}
        <div className="relative">
          <button
            onClick={toggleAccountDropdown}
            className="flex flex-col items-center text-sm hover:text-primary transition-all"
          >
            <FaUser className="text-lg mb-1" />
            <span>{user ? user.username : 'Account'}</span>
          </button>
          {accountDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-secondary rounded-md shadow-lg w-40">
              <ul className="py-2">
                {user ? (
                  <li>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block px-4 py-2 hover:bg-gray-100"
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

        {/* Help/WhatsApp */}
        <a
          href="https://wa.me/254724526080"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-sm hover:text-primary transition-all"
        >
          <FaWhatsapp className="text-lg mb-1 text-green-500" />
          <span>Help</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
