import React, { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';

const PWAInstallButton = ({ className = "" }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isInStandaloneMode = () =>
      (window.matchMedia('(display-mode: standalone)').matches) ||
      (window.navigator.standalone) ||
      document.referrer.includes('android-app://');

    if (isInStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for the app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Show a debug version if not installable (for testing)
  if (isInstalled) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className={`flex items-center space-x-2 ${isInstallable ? 'bg-primary-500 hover:bg-primary-600' : 'bg-gray-400 hover:bg-gray-500'} text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors ${className}`}
      title={isInstallable ? "Install Gatangu App" : "PWA Install (Testing)"}
    >
      <FaDownload className="text-xs" />
      <span className="hidden sm:inline">{isInstallable ? 'Install App' : 'Install'}</span>
    </button>
  );
};

export default PWAInstallButton;