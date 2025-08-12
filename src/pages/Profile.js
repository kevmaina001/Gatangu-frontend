import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaShoppingBag, 
  FaClock, 
  FaCheck, 
  FaChevronDown, 
  FaChevronUp,
  FaCalendarAlt,
  FaReceipt,
  FaBoxOpen
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL.replace('/api', '')}/api/orders/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          console.error('Error fetching orders:', data.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const toggleOrderItems = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const pendingOrders = orders.filter((order) => order.status !== 'Completed');
  const completedOrders = orders.filter((order) => order.status === 'Completed');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-backgroundLight pt-32 pb-28 md:pb-20">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-2">
            My Profile
          </h1>
          <p className="text-secondary-600">
            Manage your account and view order history
          </p>
        </motion.div>

        {/* User Information Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-medium p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mr-4">
              <FaUser className="text-2xl text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-800 mb-1">
                User Information
              </h2>
              <p className="text-secondary-500 text-sm">
                Your account details
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-xl">
              <FaUser className="text-primary-600" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Username</p>
                <p className="text-secondary-800 font-semibold">
                  {user?.username || user?.name || 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-xl">
              <FaEnvelope className="text-primary-600" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Email Address</p>
                <p className="text-secondary-800 font-semibold">
                  {user?.email || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-medium p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mr-4">
              <FaShoppingBag className="text-2xl text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-800 mb-1">
                Order History
              </h2>
              <p className="text-secondary-500 text-sm">
                Track your purchases and delivery status
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-secondary-500">Loading your orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-8">
              {/* Pending Orders */}
              {pendingOrders.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <FaClock className="text-yellow-500 mr-2" />
                    <h3 className="text-lg font-semibold text-secondary-800">
                      Pending Orders ({pendingOrders.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pendingOrders.map((order) => (
                      <motion.div
                        key={order._id}
                        className="border border-yellow-200 rounded-xl bg-yellow-50/50 p-6 hover:shadow-soft transition-all"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-sm font-medium text-secondary-600 mb-1">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-lg font-bold text-secondary-800">
                              {formatPrice(order.totalAmount)}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-secondary-500">
                                via {order.paymentMethod || 'Payment Gateway'}
                              </span>
                              {order.paymentMethod === 'WhatsApp' && (
                                <span className="text-xs ml-1">📱</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center px-3 py-1 bg-yellow-100 rounded-full">
                            <FaClock className="text-yellow-600 mr-1 text-xs" />
                            <span className="text-xs font-medium text-yellow-700">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-secondary-500 text-sm mb-4">
                          <FaCalendarAlt className="mr-2" />
                          <span>Ordered on {formatDate(order.createdAt)}</span>
                        </div>
                        
                        <motion.button
                          onClick={() => toggleOrderItems(order._id)}
                          className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="flex items-center text-secondary-700 font-medium">
                            <FaBoxOpen className="mr-2" />
                            View Items ({order.cart.length})
                          </span>
                          {expandedOrderId === order._id ? (
                            <FaChevronUp className="text-secondary-400" />
                          ) : (
                            <FaChevronDown className="text-secondary-400" />
                          )}
                        </motion.button>
                        
                        <AnimatePresence>
                          {expandedOrderId === order._id && (
                            <motion.div
                              className="mt-4 space-y-2"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {order.cart.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-secondary-100">
                                  <div>
                                    <p className="font-medium text-secondary-800">{item.name}</p>
                                    <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-semibold text-primary-600">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Orders */}
              {completedOrders.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <FaCheck className="text-green-500 mr-2" />
                    <h3 className="text-lg font-semibold text-secondary-800">
                      Completed Orders ({completedOrders.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {completedOrders.map((order) => (
                      <motion.div
                        key={order._id}
                        className="border border-green-200 rounded-xl bg-green-50/50 p-6 hover:shadow-soft transition-all"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-sm font-medium text-secondary-600 mb-1">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-lg font-bold text-secondary-800">
                              {formatPrice(order.totalAmount)}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-secondary-500">
                                via {order.paymentMethod || 'Payment Gateway'}
                              </span>
                              {order.paymentMethod === 'WhatsApp' && (
                                <span className="text-xs ml-1">📱</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center px-3 py-1 bg-green-100 rounded-full">
                            <FaCheck className="text-green-600 mr-1 text-xs" />
                            <span className="text-xs font-medium text-green-700">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-secondary-500 text-sm mb-4">
                          <FaCalendarAlt className="mr-2" />
                          <span>Delivered on {formatDate(order.createdAt)}</span>
                        </div>
                        
                        <motion.button
                          onClick={() => toggleOrderItems(order._id)}
                          className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="flex items-center text-secondary-700 font-medium">
                            <FaReceipt className="mr-2" />
                            View Receipt ({order.cart.length} items)
                          </span>
                          {expandedOrderId === order._id ? (
                            <FaChevronUp className="text-secondary-400" />
                          ) : (
                            <FaChevronDown className="text-secondary-400" />
                          )}
                        </motion.button>
                        
                        <AnimatePresence>
                          {expandedOrderId === order._id && (
                            <motion.div
                              className="mt-4 space-y-2"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {order.cart.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-secondary-100">
                                  <div>
                                    <p className="font-medium text-secondary-800">{item.name}</p>
                                    <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-semibold text-primary-600">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty States */}
              {pendingOrders.length === 0 && (
                <div className="text-center py-8">
                  <FaClock className="text-4xl text-secondary-300 mx-auto mb-4" />
                  <p className="text-secondary-500">No pending orders at the moment</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaShoppingBag className="text-6xl text-secondary-300 mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-secondary-700 mb-2">
                No Orders Yet
              </h3>
              <p className="text-secondary-500 mb-6">
                You haven't placed any orders. Start shopping to see your order history here!
              </p>
              <motion.button
                onClick={() => window.location.href = '/'}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Shopping
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
