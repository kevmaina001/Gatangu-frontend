import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
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
    <header className="bg-gray-800 text-gray-100 fixed top-0 left-0 w-full z-50 shadow-lg">
      {/* Top Bar */}
      <div className="container mx-auto flex justify-end items-center py-2 text-sm">
        <span>0724-526-080</span>
        <span className="mx-4">|</span>
        <span>0722-260-860</span>
      </div>

      {/* Main Navbar */}
      <nav className="container mx-auto font-['Poppins'] flex items-center justify-between py-4 relative">
        {/* Logo */}
        <Link
          to="/"
          className="hidden md:flex items-center text-xl font-bold text-primary"
        >
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="w-20 h-20 md:w-24 md:h-24 rounded-lg"
          />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-md mx-4 md:mx-0"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-black text-sm focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              <FaSearch className="text-lg" />
            </button>
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white text-black border border-gray-300 rounded-md mt-1 z-50 shadow-lg">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(item);
                      setSuggestions([]);
                      navigate(`/search?q=${item}`);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {user && (
            <div className="relative">
              <button
                onClick={toggleAccountDropdown}
                className="flex items-center hover:text-primary focus:outline-none"
              >
                <FaUser className="mr-2" />
                Hi, {user.username}
              </button>
              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg z-50">
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
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {!user && (
            <>
              <Link to="/login" className="hover:text-primary">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-primary">
                Register
              </Link>
            </>
          )}
          <Link to="/cart" className="relative flex items-center hover:text-primary">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white rounded-full px-2 text-xs font-bold">
                {cart.length}
              </span>
            )}
            <span className="ml-2">Cart</span>
          </Link>
          {user?.id === ADMIN_ID && (
            <Link
              to="/admin-panel"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
