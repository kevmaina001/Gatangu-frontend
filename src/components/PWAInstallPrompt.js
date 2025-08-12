import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload, FaMobile, FaDesktop } from 'react-icons/fa';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check if app is already installed
    const isInStandaloneMode = () =>
      (window.matchMedia('(display-mode: standalone)').matches) ||
      (window.navigator.standalone) ||
      document.referrer.includes('android-app://');

    if (isInStandaloneMode()) {
      return; // Don't show install prompt if already installed
    }

    // Check if user has dismissed the prompt in this session
    if (sessionStorage.getItem('installPromptDismissed')) {
      return;
    }

    // For iOS devices, show the prompt immediately since they don't have beforeinstallprompt
    if (isIOSDevice) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000); // Show after 5 seconds for iOS
      return;
    }

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Show the install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000); // Show after 3 seconds
    };

    // Also show for devices that support PWA but haven't fired the event yet
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isIOSDevice) {
        // For browsers that support PWA but haven't fired the event
        console.log('Fallback PWA prompt showing');
        setIsInstallable(true);
        setShowInstallPrompt(true);
      }
    }, 8000); // Show after 8 seconds as fallback

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(fallbackTimer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Add a test trigger for development (remove in production)
  useEffect(() => {
    const testTrigger = () => {
      if (window.location.search.includes('test-pwa')) {
        setShowInstallPrompt(true);
        setIsInstallable(true);
      }
    };
    testTrigger();
  }, []);

  // Don't show if user has already dismissed it this session
  if (sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      {(showInstallPrompt && (isInstallable || isIOS)) && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                  <img
                    src="/images/logo.jpg"
                    alt="Gatangu Logo"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Install Gatangu App</h3>
                  <p className="text-sm text-gray-500">Get the best shopping experience</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaMobile className="text-green-600 text-sm" />
                </div>
                <span className="text-sm text-gray-700">Access from your home screen</span>
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaDesktop className="text-blue-600 text-sm" />
                </div>
                <span className="text-sm text-gray-700">Works offline</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaDownload className="text-purple-600 text-sm" />
                </div>
                <span className="text-sm text-gray-700">Fast and secure</span>
              </div>
            </div>

            {isIOS ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  To install this app on your iPhone/iPad:
                </p>
                <div className="bg-blue-50 p-3 rounded-lg text-left text-sm text-gray-700 mb-4">
                  <p className="mb-1">1. Tap the Share button <span className="font-mono">⎄</span></p>
                  <p className="mb-1">2. Scroll down and tap "Add to Home Screen"</p>
                  <p>3. Tap "Add" to confirm</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Got it!
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <FaDownload className="text-sm" />
                  <span>Install</span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;