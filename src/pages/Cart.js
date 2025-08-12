import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft,
  FaLock,
  FaUserPlus,
  FaCheckCircle
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { getFinalImageURL, handleImageError } from '../utils/imageUtils';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '', location: '', note: '' });
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity, 10));
    updateQuantity(productId, quantity);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateTokenBeforePayment = () => {
    try {
      const decoded = jwtDecode(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        alert('Session expired. Please log in again to proceed with payment.');
        logout(); // Logout the user
        navigate('/login'); // Redirect to login page
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token validation error:', error.message);
      alert('Invalid session. Please log in again.');
      logout();
      navigate('/login');
      return false;
    }
  };

  const handleWhatsAppCheckout = async () => {
    if (!formData.name || !formData.email || !formData.location) {
      alert('Please fill out all required fields before proceeding to checkout.');
      return;
    }

    if (!validateTokenBeforePayment()) return;

    setLoading(true);
    try {
      // Save order to backend first
      const response = await fetchWithAuth(
        `${API_URL.replace('/api', '')}/api/orders`,
        token,
        logout,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            cart,
            totalAmount,
            paymentMethod: 'WhatsApp',
            paymentReference: `WA-${Date.now()}`, // Generate WhatsApp reference
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Send order details to WhatsApp
        sendOrderDetailsToWhatsApp(data._id);
      } else {
        alert(`Failed to process order: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing order:', error.message);
      alert('An error occurred while processing your order.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/register', { state: { from: '/cart' } });
    }
  };


  const sendOrderDetailsToWhatsApp = (orderId) => {
    const formattedCart = cart
      .map((item, index) => `${index + 1}. ${item.name} - Qty: ${item.quantity} - ${formatPrice(item.price)} each`)
      .join('\n');

    const orderRef = orderId ? orderId.slice(-8).toUpperCase() : 'N/A';

    const message = `*GATANGU ENTERPRISE*
*NEW ORDER REQUEST*
========================

*ORDER ID: #${orderRef}*

*CUSTOMER INFORMATION*
Name: ${formData.name}
Email: ${formData.email}
Location: ${formData.location}
Instructions: ${formData.note || 'None'}

*ORDER DETAILS*
${formattedCart}

*TOTAL: ${formatPrice(totalAmount)}*
========================

Please confirm this order and provide payment instructions.

You can track this order in your profile on our website.

Thank you for choosing Gatangu Enterprise.`;

    const whatsappURL = `https://wa.me/254708328905?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    // Clear cart after sending to WhatsApp
    clearCart();
    alert('Order saved and sent to WhatsApp! You can track this order in your profile.');
  };

  return (
    <div className="min-h-screen bg-backgroundLight pt-32 pb-28 md:pb-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link 
            to="/"
            className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <FaArrowLeft />
            <span>Continue Shopping</span>
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 flex items-center">
            <FaShoppingCart className="mr-3 text-primary-500" />
            Shopping Cart
          </h1>
          
          <div className="text-sm text-secondary-500">
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {cart.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item._id}
                      className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-secondary-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={getFinalImageURL(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-secondary-800 text-lg mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-secondary-500 text-sm mb-2">
                            Unit Price: {formatPrice(item.price)}
                          </p>
                          
                          {/* Mobile Quantity Controls */}
                          <div className="flex items-center justify-between md:hidden">
                            <div className="flex items-center border border-secondary-200 rounded-lg overflow-hidden">
                              <motion.button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaMinus className="text-xs" />
                              </motion.button>
                              <span className="px-4 py-2 font-semibold min-w-[50px] text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                className="p-2 hover:bg-secondary-100 transition-colors"
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaPlus className="text-xs" />
                              </motion.button>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className="font-bold text-primary-600">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              <motion.button
                                onClick={() => removeFromCart(item._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaTrash className="text-sm" />
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Quantity Controls */}
                        <div className="hidden md:flex items-center space-x-6">
                          <div className="flex items-center border border-secondary-200 rounded-lg overflow-hidden">
                            <motion.button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-3 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaMinus className="text-sm" />
                            </motion.button>
                            <span className="px-6 py-3 font-semibold min-w-[60px] text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="p-3 hover:bg-secondary-100 transition-colors"
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaPlus className="text-sm" />
                            </motion.button>
                          </div>

                          <div className="text-right min-w-[120px]">
                            <div className="font-bold text-lg text-primary-600">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>

                          <motion.button
                            onClick={() => removeFromCart(item._id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 sticky top-36">
                  <h2 className="text-xl font-bold text-secondary-800 mb-6 flex items-center">
                    <FaCheckCircle className="mr-2 text-primary-500" />
                    Order Summary
                  </h2>

                  {/* Order Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-secondary-600">
                      <span>Subtotal ({cart.length} items)</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-secondary-600">
                      <span>Delivery Fee</span>
                      <span className="text-success">Free</span>
                    </div>
                    <div className="border-t border-secondary-200 pt-4">
                      <div className="flex justify-between text-lg font-bold text-secondary-800">
                        <span>Total</span>
                        <span className="text-primary-600">{formatPrice(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Section */}
                  {!user ? (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-center p-4 bg-primary-50 rounded-xl">
                        <FaUserPlus className="mx-auto text-2xl text-primary-600 mb-2" />
                        <p className="text-secondary-700 mb-4">
                          Sign up to complete your order
                        </p>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        <FaUserPlus />
                        <span>Sign Up to Place Order</span>
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full border border-secondary-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email for receipt"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border border-secondary-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                          required
                        />
                        <input
                          type="text"
                          name="location"
                          placeholder="Delivery Location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full border border-secondary-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                          required
                        />
                        <textarea
                          name="note"
                          placeholder="Delivery instructions (optional)"
                          value={formData.note}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full border border-secondary-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                        />
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-secondary-500 bg-green-50 p-3 rounded-xl">
                        <span className="text-lg">💬</span>
                        <span>Complete your order via WhatsApp</span>
                      </div>

                      <motion.button
                        onClick={handleWhatsAppCheckout}
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-3"
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing Order...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl">📱</span>
                            <span>Checkout via WhatsApp</span>
                          </>
                        )}
                      </motion.button>
                      
                      <p className="text-xs text-secondary-500 text-center">
                        Your order details will be sent to WhatsApp where you can complete the payment process
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="w-32 h-32 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="text-4xl text-secondary-400" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-secondary-500 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. 
                Start shopping to fill it up!
              </p>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
              >
                <FaShoppingCart />
                <span>Start Shopping</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;