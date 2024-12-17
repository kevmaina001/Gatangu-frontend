import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import PaystackPayment from '../components/PaystackPayment';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '', location: '', note: '' });
  const { user } = useAuth();
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
    await submitOrder(reference.reference);
  };

  const submitOrder = async (paymentReference) => {
    if (!formData.name || !formData.email || !formData.location) {
      alert('Please fill out all required fields before placing your order.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          cart,
          totalAmount,
          paymentReference,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Order placed successfully! Thank you For Shopping with our E-commerce platform');
        sendOrderDetailsToWhatsApp(); // Send order details via WhatsApp

        clearCart();
      } else {
        alert(`Failed to place the order: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const sendOrderDetailsToWhatsApp = () => {
    const formattedCart = cart
      .map((item) => `${item.name} - Qty: ${item.quantity}, Price: Ksh. ${item.price}`)
      .join('%0A'); // %0A is for a new line in URLs
  
    const message = `
      *New Order Placed*%0A
      *Name:* ${formData.name}%0A
      *Email:* ${formData.email}%0A
      *Location:* ${formData.location}%0A
      *Note:* ${formData.note || 'N/A'}%0A
      *Total Amount:* Ksh. ${totalAmount}%0A%0A
      *Order Items:*%0A${formattedCart}
    `;
  
    const whatsappURL = `https://wa.me/254708328905?text=${encodeURI(message)}`;
    window.open(whatsappURL, '_blank');
  };
  

  return (
    <div className="container mx-auto pt-[10rem] pb-40 px-4">
      <h2 className="text-5xl font-playfair mb-8 text-center text-gray-800 tracking-wide">
          Shopping Cart
        </h2>


      {cart.length > 0 ? (
        <>
         <ul className="space-y-6">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                {/* Image and Item Details */}
                <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  {/* <img
                    src={item.image ? `${API_URL}/${item.image}` : '/images/placeholder.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  /> */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">Price: Ksh. {item.price}</p>
                  </div>
                </div>

                {/* Quantity Controls and Remove Button */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-l-md"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                      className="w-12 text-center border-0 focus:ring-0"
                    />
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* Total Price */}
                <p className="font-bold text-gray-700 mt-2 sm:mt-0">Ksh. {item.price * item.quantity}</p>
              </li>
            ))}
          </ul>
               
          <div className="bg-white rounded-lg shadow-md p-6 mt-10 max-w-lg mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Checkout Details</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email to receive receipt"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <textarea
              name="note"
              placeholder="Add a note (e.g., delivery instructions)"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>

            <PaystackPayment
              amount={totalAmount}
              email={formData.email}
              onSuccess={handlePaymentSuccess}
              onClose={() => console.log('Payment closed')}
            />
            {loading && <p className="text-center text-gray-500 mt-4">Placing your order...</p>}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 animate-fadeIn">
          Your shopping basket is empty. Don’t miss out on great deals!{' '}
          <Link to="/" className="text-green-500 hover:underline hover:text-green-600 transition-colors">
            Start shopping now 
          </Link>
          {' '} at Gatangu Enterprises Dashboard to find amazing products.
        </p>

      )}
    </div>
  );
};

export default CartPage;
