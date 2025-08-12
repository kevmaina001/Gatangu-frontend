import React, { useState } from 'react';

const PWATestButton = () => {
  const [showTestPrompt, setShowTestPrompt] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setShowTestPrompt(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Test PWA Popup
      </button>
      
      {showTestPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
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
                onClick={() => setShowTestPrompt(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                This is a test version of the PWA install prompt.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowTestPrompt(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('PWA Install button clicked!');
                  setShowTestPrompt(false);
                }}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWATestButton;