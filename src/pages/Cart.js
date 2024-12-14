import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart(); // Access cart data and methods
  const [showCheckout, setShowCheckout] = useState(false); // State to toggle checkout form
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    note: '',
  });

  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity, 10));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkout submission
  const handleCheckout = () => {
    alert(`Order placed successfully! 
    Name: ${formData.name} 
    Location: ${formData.location} 
    Note: ${formData.note}`);
    clearCart(); // Clear the cart after placing the order
    setShowCheckout(false); // Hide the checkout form
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
      <h2 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h2>

      {cart.length > 0 ? (
        <>
         {/* Cart Items */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
            {cart.map((item) => {
              const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image ? `${BASE_URL}/${item.image}` : '/images/placeholder.jpg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Price: Ksh. {item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Quantity Input */}
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                      className="w-16 text-center border border-gray-300 rounded-md"
                    />
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="font-bold">Ksh. {item.price * item.quantity}</p>
                </div>
              );
            })}
          </div>


          {/* Total and Checkout */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-end space-y-4">
            <div className="text-lg font-bold flex justify-between w-full">
              <span>Total:</span>
              <span>Ksh. {totalAmount}</span>
            </div>
            <div className="flex space-x-4">
              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Clear Cart
              </button>
              {/* Toggle Checkout Form */}
              <button
                onClick={() => setShowCheckout(!showCheckout)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                {showCheckout ? 'Cancel Checkout' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>

          {/* Checkout Form */}
          {showCheckout && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-6 w-full md:w-1/2 mx-auto">
              <h3 className="text-xl font-bold mb-4">Checkout Details</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {/* Name Input */}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />

                {/* Location Input */}
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />

                {/* Note for the Order */}
                <textarea
                  name="note"
                  placeholder="Add a note for the order (e.g., delivery instructions)"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows="4"
                />

                {/* Submit Checkout */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600"
                >
                  Place Order
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">
          Your cart is empty. <Link to="/" className="text-green-500 hover:underline">Go shopping</Link>
        </p>
      )}
    </div>
  );
};

export default CartPage;
