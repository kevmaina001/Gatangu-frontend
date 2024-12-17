import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          console.error('Error fetching orders:', data.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const toggleOrderItems = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const pendingOrders = orders.filter((order) => order.status !== 'Completed');
  const completedOrders = orders.filter((order) => order.status === 'Completed');

  return (
    <div className="container mx-auto py-40 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-2">User Information</h3>
        <p className="text-gray-700"><strong>Name:</strong> {user?.name}</p>
        <p className="text-gray-700"><strong>Email:</strong> {user?.email}</p>
      </div>

      {/* Orders Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-center">Order History</h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : orders.length > 0 ? (
          <div>
            {/* Pending Orders */}
            <h4 className="text-lg font-semibold mb-4 text-yellow-600">Pending Orders</h4>
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
              {pendingOrders.length > 0 ? (
                pendingOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg shadow-sm bg-gray-50 p-4 hover:shadow-md transition"
                  >
                    <p className="font-semibold">Order ID: {order._id}</p>
                    <p className="text-gray-600">
                      Total: Ksh. {order.totalAmount} | Date:{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-yellow-600 font-medium">Status: {order.status}</p>
                    <button
                      onClick={() => toggleOrderItems(order._id)}
                      className="mt-2 text-blue-500 hover:underline"
                    >
                      {expandedOrderId === order._id ? 'Hide Items' : 'View Items'}
                    </button>
                    {expandedOrderId === order._id && (
                      <ul className="mt-2 bg-gray-100 p-2 rounded">
                        {order.cart.map((item, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {item.name} - {item.quantity} x Ksh. {item.price}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-2">No pending orders.</p>
              )}
            </div>

            {/* Completed Orders */}
            <h4 className="text-lg font-semibold my-4 text-green-600">Completed Orders</h4>
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
              {completedOrders.length > 0 ? (
                completedOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg shadow-sm bg-gray-50 p-4 hover:shadow-md transition"
                  >
                    <p className="font-semibold">Order ID: {order._id}</p>
                    <p className="text-gray-600">
                      Total: Ksh. {order.totalAmount} | Date:{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-green-600 font-medium">Status: {order.status}</p>
                    <button
                      onClick={() => toggleOrderItems(order._id)}
                      className="mt-2 text-blue-500 hover:underline"
                    >
                      {expandedOrderId === order._id ? 'Hide Items' : 'View Items'}
                    </button>
                    {expandedOrderId === order._id && (
                      <ul className="mt-2 bg-gray-100 p-2 rounded">
                        {order.cart.map((item, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {item.name} - {item.quantity} x Ksh. {item.price}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-2">No completed orders.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
