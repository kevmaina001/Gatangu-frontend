import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext'; // Access the cart context

const Checkout = () => {
  const { cart, clearCart } = useCart(); // Access cart data and clearCart function
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    note: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Show an error message if the cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      alert('Your cart is empty! Please add items to proceed.');
    }
  }, [cart]);

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
      {cart.length > 0 ? (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center justify-between mb-4">
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
      ) : (
        <p className="text-center text-red-500">Your cart is empty.</p>
      )}

      {/* Checkout Form */}
      {cart.length > 0 && (
        <form onSubmit={(e) => e.preventDefault()} className="max-w-lg mx-auto space-y-4">
          <h3 className="text-2xl font-semibold mb-2">Shipping Information</h3>

          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />

          {/* Location Input */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />

          {/* Note for the Order */}
          <textarea
            name="note"
            placeholder="Add a note for the order (e.g., delivery instructions)"
            value={formData.note}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            rows="4"
          />

          {/* Submit Order */}
          <button
            type="button"
            onClick={() => {
              alert('Order placed successfully!');
              clearCart(); // Clear cart after order placement
            }}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600"
          >
            Place Order
          </button>
        </form>
      )}
    </div>
  );
};

export default Checkout;
