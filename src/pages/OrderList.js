import React, { useState, useEffect } from 'react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch(`${API_URL}/orders`);
    const data = await response.json();
    setOrders(data.filter((order) => !order.completed));
  };

  const handleMarkComplete = async (orderId) => {
    await fetch(`${API_URL}/orders/${orderId}/complete`, { method: 'PUT' });
    fetchOrders();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
      <ul className="space-y-2">
        {orders.map((order) => (
          <li key={order._id} className="bg-white p-4 rounded shadow">
            <p>Order by: {order.name}</p>
            <p>Total: Ksh. {order.totalAmount}</p>
            <button
              onClick={() => handleMarkComplete(order._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
            >
              Mark Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
