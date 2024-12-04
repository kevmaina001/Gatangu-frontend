import React, { useState, useEffect } from 'react';

function Checkout() {
  const paystackPublicKey = 'pk_live_26d6ae7b0368c7e840c4f45d6d2e8d679317f833'; // Replace with your Paystack public key
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    const loadPaystackSDK = () => {
      if (!document.querySelector("script[src='https://js.paystack.co/v1/inline.js']")) {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => {
          console.log('Paystack SDK loaded successfully');
          setPaystackLoaded(true);
        };
        script.onerror = () => {
          console.error('Failed to load Paystack SDK');
        };
        document.body.appendChild(script);
      } else {
        setPaystackLoaded(true); // Script is already loaded
      }
    };

    loadPaystackSDK();
  }, []);

  const handlePaystackDonateClick = () => {
    if (!email || !amount) {
      setError('Please enter a valid email and amount.');
      return;
    }

    if (!paystackLoaded || !window.PaystackPop?.setup) {
      alert('Paystack SDK is not loaded. Please try again later.');
      return;
    }

    setError('');

    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: email,
      amount: amount * 100, // Convert amount to kobo
      currency: 'KES',
      callback: function (response) {
        alert(`Payment successful! Reference: ${response.reference}`);
        setEmail('');
        setAmount('');
      },
      onClose: function () {
        alert('Payment window closed.');
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      alert('Failed to initialize Paystack. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-8">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md relative">
        <h1 className="text-4xl font-bold mb-4">Checkout</h1>
        <p className="text-lg mb-6">Complete your purchase using Paystack.</p>

        <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
        <input
          type="number"
          placeholder="Enter amount (KES)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg text-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg text-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          className="bg-green-600 w-full px-8 py-3 rounded-lg text-white hover:bg-green-700 transform transition duration-200 ease-in-out hover:scale-105"
          onClick={handlePaystackDonateClick}
          disabled={!email || !amount || !paystackLoaded}
        >
          Pay with Paystack
        </button>
      </div>
    </div>
  );
}

export default Checkout;
