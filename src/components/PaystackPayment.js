import React, { useState } from 'react';
import { PaystackButton } from 'react-paystack';

const PaystackPayment = ({ amount, email, onSuccess, onClose }) => {
  const [error, setError] = useState(null);
  const publicKey = 'pk_live_21e4b51404eaf8f48573ed643779daad54171a86';
  const currency = 'KES'; // Set to Kenyan Shillings

  const handlePaymentClose = () => {
    console.log('Payment prompt closed by the user.');
    setError('Payment was not completed. Please try again or use a different method.');
    onClose();
  };

  const componentProps = {
    email,
    amount: amount * 100, // Convert to kobo (Paystack's smallest unit)
    currency,
    publicKey,
    text: 'Pay Order',
    onSuccess: (reference) => {
      console.log('Payment Successful:', reference);
      setError(null); // Clear any previous errors
      onSuccess(reference);
    },
    onClose: handlePaymentClose,
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <PaystackButton
        {...componentProps}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      />
    </div>
  );
};

export default PaystackPayment;
