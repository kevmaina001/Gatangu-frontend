import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; // Access the cart context

const Checkout = () => {
  const { cart } = useCart(); // Access cart data
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure cart has items before proceeding
    if (cart.length === 0) {
      alert('Your cart is empty. Add some products before checking out.');
      return;
    }

    // Prepare order data
    const orderData = {
      customer: formData,
      items: cart,
      totalAmount: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    };

    console.log('Order Data:', orderData); // Debugging log

    // Replace with backend API integration
    try {
      // Simulate order submission (replace with real API call)
      alert('Your order has been placed successfully!');
      console.log('Order placed successfully:', orderData);

      // Clear the cart if order is successful
      // Replace this logic with a clear cart function in the context
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Checkout</h2>

      {/* Cart Summary */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between mb-4"
          >
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity}
              </p>
            </div>
            <p className="font-bold">
              Ksh. {item.price * item.quantity}
            </p>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg">
          <p>Total:</p>
          <p>
            Ksh. {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
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

        {/* <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        /> */}

        {/* <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        /> */}

        {/* <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        /> */}

        {/* <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        /> */}

        {/* Payment Information */}
        <h3 className="text-2xl font-semibold mt-6 mb-2">Payment Information</h3>

        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={formData.cardNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="text"
          name="expiryDate"
          placeholder="Expiry Date (MM/YY)"
          value={formData.expiryDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={formData.cvv}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        {/* Place Order Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
