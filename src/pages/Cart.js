import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import PaystackPayment from '../components/PaystackPayment';
import { useAuth } from '../context/AuthContext'; // Adjust path if necessary


const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '', location: '', note: '' });
  const { user } = useAuth(); // Get the authenticated user
  console.log('User:', user?.email);

  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity, 10));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentSuccess = async (reference) => {
    console.log('Payment Reference:', reference);
    await submitOrder(reference.reference); // Pass the payment reference
  };
  const submitOrder = async (paymentReference) => {
    setLoading(true);
    console.log('Token being sent in Authorization header:', localStorage.getItem('token')); // Debug log
  
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Retrieve token from localStorage
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          location: formData.location,
          note: formData.note,
          cart,
          totalAmount,
          paymentReference, // Include the payment reference
        }),
      });
  
      const data = await response.json(); // Parse response
      console.log('Order Response:', data); // Debug log
  
      if (response.ok) {
        alert('Order placed successfully!');
        clearCart(); // Clear the cart
      } else {
        console.error('Failed to place order:', data.message);
        alert(`Failed to place the order: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto py-20">
      <h2 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h2>

      {cart.length > 0 ? (
        <>
          {/* Cart Items */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image ? `${API_URL}/${item.image}` : '/images/placeholder.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Price: Ksh. {item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    className="w-16 text-center border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <p className="font-bold">Ksh. {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Checkout Form */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-6 w-full md:w-1/2 mx-auto">
            <h3 className="text-xl font-bold mb-4">Checkout Details</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              required
            />
            <textarea
              name="note"
              placeholder="Add a note (e.g., delivery instructions)"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded mb-4"
            ></textarea>

            {/* Paystack Payment Button */}
            <PaystackPayment
              amount={totalAmount} // Total amount to be paid
              email={formData.email}
              onSuccess={handlePaymentSuccess}
              onClose={() => console.log('Payment closed')}
            />
            {loading && <p className="text-center text-gray-500">Placing your order...</p>}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">
          Your cart is empty.{' '}
          <Link to="/" className="text-green-500 hover:underline">
            Go shopping
          </Link>
        </p>
      )}
    </div>
  );
};

export default CartPage;
