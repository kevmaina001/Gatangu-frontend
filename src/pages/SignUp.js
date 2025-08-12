import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`${API_URL.replace('/api', '')}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { state: { from: '/cart' } });
        }, 2000);
      } else {
        setError(data.msg || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4 pt-24">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <img
              src="/images/logo.jpg"
              alt="Gatangu Logo"
              className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-medium mb-4"
            />
          </motion.div>
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-secondary-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join Gatangu
          </motion.h1>
          <motion.p
            className="text-secondary-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create your account to get started
          </motion.p>
        </div>

        {/* Sign Up Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-medium p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Error/Success Messages */}
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {successMessage}
            </motion.div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-secondary-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="block w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-secondary-800 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-secondary-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-secondary-800 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-secondary-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="block w-full pl-10 pr-12 py-3 border border-secondary-200 rounded-xl text-secondary-800 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <FaEye className="text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-secondary-200"></div>
            <span className="px-4 text-sm text-secondary-500 bg-white">or</span>
            <div className="flex-1 border-t border-secondary-200"></div>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-secondary-200 rounded-xl text-secondary-700 hover:bg-secondary-50 transition-colors"
            >
              <FaGoogle className="text-red-500 mr-3" />
              Sign up with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-secondary-200 rounded-xl text-secondary-700 hover:bg-secondary-50 transition-colors"
            >
              <FaFacebook className="text-blue-600 mr-3" />
              Sign up with Facebook
            </button>
          </div>
        </motion.div>

        {/* Sign In Link */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-secondary-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign In
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;
