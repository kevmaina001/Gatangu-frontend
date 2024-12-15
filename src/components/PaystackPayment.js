import React from 'react';
import { PaystackButton } from 'react-paystack';

const PaystackPayment = ({ amount, email, onSuccess, onClose }) => {
  const publicKey = 'pk_live_ce30fb917a1c53531bd026eb6e0dc22708ef89f7'; // Updated key
  const currency = 'KES'; // Explicitly set the currency to Kenyan Shillings

  const componentProps = {
    email,
    amount: amount * 100, // Convert to kobo (Paystack smallest unit)
    currency, // Ensure KES is passed for Kenyan Shillings
    publicKey,
    text: 'Pay Order',
    onSuccess: (reference) => {
      console.log('Payment Successful:', reference);
      onSuccess(reference); // Trigger the success callback
    },
    onClose: () => {
      console.log('Payment closed');
      onClose();
    },
  };

  return (
    <PaystackButton
      {...componentProps}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
    />
  );
};

export default PaystackPayment;
