import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart(); // Access cart state and functions
  const navigate = useNavigate(); // To navigate to the checkout page

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle checkout navigation
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some products before proceeding to checkout.');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div
      className="container mx-auto py-20"
      style={{
        fontFamily: `'Roboto', 'Poppins', sans-serif`,
        paddingTop: '200px', // Padding at the top
        paddingBottom: '150px', // Padding at the bottom
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Your cart is empty. Start shopping now!
        </p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id} // Use `_id` as the key
              className="flex items-center bg-white shadow-md rounded-lg p-4 space-x-4 hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div
                className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg"
              >
                <img
                  src={`https://gatangu-backend-1.onrender.com/${item.image}`} // Fetch image from backend
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm">Price: Ksh. {item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-gray-600 text-sm">Quantity:</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, parseInt(e.target.value, 10))
                    } // Use `_id` to update quantity
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                  />
                </div>
              </div>
              {/* Item Total */}
              <p className="text-lg font-bold text-gray-800">
                Ksh. {(item.price * item.quantity).toFixed(2)}
              </p>
              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item._id)} // Use `_id` to remove
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          {/* Total Price and Checkout */}
          <div className="text-right mt-6">
            <h3 className="text-2xl font-bold text-gray-800">Total: Ksh. {totalPrice.toFixed(2)}</h3>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
