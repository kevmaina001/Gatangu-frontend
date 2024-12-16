import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token } = useAuth(); // Get authenticated user and token
  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true); // State to manage loading indicator

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/user`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in Authorization header
          },
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data); // Set the orders if the response is successful
        } else {
          console.error('Error fetching orders:', data.message); // Log the error message
        }
      } catch (error) {
        console.error('Error fetching orders:', error); // Log unexpected errors
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    if (token) {
      fetchOrders(); // Fetch orders only if token is available
    }
  }, [token]);

  return (
    <div className="container mx-auto pt-40">
      <h2 className="text-3xl font-bold mb-6">Profile</h2>

      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold">User Information</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      {/* Order History */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Order History</h3>
        {loading ? (
          <p>Loading...</p>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="border-b border-gray-200 py-4">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`font-semibold ${
                    order.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p><strong>Total:</strong> Ksh. {order.totalAmount}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <h4 className="font-semibold mt-2">Items:</h4>
              <ul className="list-disc pl-5">
                {order.cart.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} x Ksh. {item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
