import React, { useState, useEffect } from 'react';
import AddProduct from './AddProduct'; // Import AddProduct Component

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('addProduct');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true); // Loading state for orders
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({});
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch Products and Orders on load
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch orders from the backend
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Retrieve token
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
  
      if (Array.isArray(data)) {
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        console.error('Unexpected data format:', data);
        setOrders([]); // Set orders to an empty array if response is invalid
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoadingOrders(false);
    }
  };
  

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Open the edit modal for a product
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditData({ ...product });
  };

  // Close the edit modal
  const closeEditModal = () => {
    setEditingProduct(null);
  };

  // Update a product
  const updateProduct = async () => {
    if (!editData.name || !editData.price) {
      alert('Name and Price are required fields.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!response.ok) throw new Error('Failed to update product');
      closeEditModal();
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Mark an order as complete
  const markAsComplete = async (id) => {
    console.log(`Marking Order as Complete - ID: ${id}`); // Debug ID
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
        },
        body: JSON.stringify({ status: 'Completed' }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status');
      }
  
      console.log('Order marked as complete successfully:', data);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error marking order as complete:', error.message);
    }
  };
  

  return (
    <div className="container mx-auto pt-40">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'addProduct' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('addProduct')}
        >
          Add Product
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'manageProducts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('manageProducts')}
        >
          Manage Products
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'viewOrders' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('viewOrders')}
        >
          View Orders
        </button>
      </div>

      {/* Add Product */}
      {activeTab === 'addProduct' && <AddProduct onProductAdded={fetchProducts} />}

      {/* Manage Products */}
      {activeTab === 'manageProducts' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product._id} className="flex justify-between border-b py-2">
                <span>{product.name} - ${product.price}</span>
                <div>
                  <button
                    onClick={() => openEditModal(product)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded w-1/3">
                <h3 className="text-xl mb-2">Edit Product</h3>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <div className="flex justify-end">
                  <button onClick={closeEditModal} className="bg-gray-500 text-white px-4 py-2 mr-2">
                    Cancel
                  </button>
                  <button onClick={updateProduct} className="bg-green-500 text-white px-4 py-2">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Orders */}
      {activeTab === 'viewOrders' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">View Orders</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : (
            <>
              <h3 className="text-lg font-semibold">Pending Orders</h3>
              <ul>
                {orders
                  .filter((order) => order.status === 'Pending')
                  .map((order) => (
                    <li key={order._id} className="flex justify-between border-b py-2">
                      {order.name} - ${order.totalAmount}
                      <button
                        onClick={() => markAsComplete(order._id)}
                        className="bg-green-500 text-white px-2 py-1"
                      >
                        Mark as Complete
                      </button>
                    </li>
                  ))}
              </ul>
              <h3 className="text-lg font-semibold mt-4">Completed Orders</h3>
              <ul>
                {orders
                  .filter((order) => order.status === 'Completed')
                  .map((order) => (
                    <li key={order._id} className="border-b py-2">
                      {order.name} - ${order.totalAmount} (Completed)
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
