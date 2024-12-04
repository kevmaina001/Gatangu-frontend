import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; // Access the cart context

const Checkout = () => {
  const { cart, clearCart } = useCart(); // Access cart data and clearCart function
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    note: '', // Added note field for user instructions
  });

  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Paystack payment
  const handlePaystackPayment = () => {
    const paystack = new window.PaystackPop();

    paystack.newTransaction({
      key: 'pk_live_26d6ae7b0368c7e840c4f45d6d2e8d679317f833', // Replace with your Paystack public key
      email: formData.email,
      amount: totalAmount, // Paystack expects amount in kobo (for NGN)
      currency: 'KES', // Change to your preferred currency
      onSuccess: async (transaction) => {
        console.log('Payment Success:', transaction);
        alert(`Payment successful! Reference: ${transaction.reference}`);

        // Prepare order data
        const orderData = {
          customer: formData,
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
          totalAmount,
          note: formData.note,
          paymentReference: transaction.reference,
        };

        try {
          // Send order details to the backend
          const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
          });

          const data = await response.json();
          if (response.ok) {
            clearCart(); // Clear the cart after successful order placement
            alert('Order placed successfully!');
          } else {
            alert('Failed to save order details. Please contact support.');
          }
        } catch (error) {
          console.error('Error saving order details:', error);
          alert('An error occurred while saving your order. Please try again.');
        }
      },
      onCancel: () => {
        alert('Payment canceled.');
      },
    });
  };

  return (
    <div
      className="container mx-auto py-20"
      style={{
        fontFamily: `'Roboto', 'Poppins', sans-serif`,
        paddingTop: '115px',
        paddingBottom: '150px',
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Checkout</h2>

      {/* Cart Summary */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-bold">Ksh. {item.price * item.quantity}</p>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg">
          <p>Total:</p>
          <p>Ksh. {totalAmount}</p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="max-w-lg mx-auto space-y-4">
        {/* Shipping Information */}
        <h3 className="text-2xl font-semibold mb-2">Shipping Information</h3>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        {/* Note for the Order */}
        <textarea
          name="note"
          placeholder="Add a note for the order (e.g., packaging instructions, delivery details)"
          value={formData.note}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          rows="4"
        />

        {/* Paystack Payment Button */}
        <button
          type="button"
          onClick={handlePaystackPayment}
          className="w-full bg-green-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-600"
        >
          Pay with Paystack
        </button>
      </form>
    </div>
  );
};

export default Checkout;
