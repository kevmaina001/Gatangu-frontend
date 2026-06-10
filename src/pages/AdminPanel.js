import React, { useState, useEffect } from 'react';
import AddProduct from './AddProduct'; // Import AddProduct Component
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
const AdminPanel = () => {
const ADMIN_ID = '674e4b8c22fc2df1f90d95ae'; // Hardcoded Admin User ID
  const [activeTab, setActiveTab] = useState('addProduct');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true); // Loading state for orders
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({});
  const [productSortBy, setProductSortBy] = useState('name');
  const [productSortOrder, setProductSortOrder] = useState('asc');
  const [productFilterCategory, setProductFilterCategory] = useState('All');
  const [orderFilterStatus, setOrderFilterStatus] = useState('All');
  const [orderSortBy, setOrderSortBy] = useState('createdAt');
  const [orderSortOrder, setOrderSortOrder] = useState('desc');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categoryProductSort, setCategoryProductSort] = useState({});
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const { user, token, logout } = useAuth(); // Retrieve user info, token, and logout function
  const navigate = useNavigate();

  // Redirect if the user is not an admin
     // Redirect non-admin users
  useEffect(() => {
    if (!user || user.id !== ADMIN_ID) {
      alert('Go to Hell');
      navigate('/');
    }
  }, [user, navigate]);
  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch orders from the backend
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetchWithAuth(`${API_URL}/orders`, token, logout);
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Products and Orders on load
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

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

  // Helper functions for sorting and filtering
  const sortProducts = (products) => {
    const filtered = productFilterCategory === 'All' 
      ? products 
      : products.filter(product => product.category === productFilterCategory);
    
    return filtered.sort((a, b) => {
      let aValue = a[productSortBy];
      let bValue = b[productSortBy];
      
      if (productSortBy === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (productSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const sortOrders = (orders) => {
    const filtered = orderFilterStatus === 'All' 
      ? orders 
      : orders.filter(order => order.status === orderFilterStatus);
    
    return filtered.sort((a, b) => {
      let aValue = a[orderSortBy];
      let bValue = b[orderSortBy];
      
      if (orderSortBy === 'totalAmount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (orderSortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (orderSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Get unique categories from products
  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    return ['All', ...categories.filter(cat => cat)];
  };

  // Calculate statistics
  const getStatistics = () => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const completedOrders = orders.filter(order => order.status === 'Completed').length;
    const totalRevenue = orders
      .filter(order => order.status === 'Completed')
      .reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
    
    const categoryStats = products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      categoryStats
    };
  };

  const stats = getStatistics();

  // Toggle category expansion
  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Get products for a specific category with sorting
  const getCategoryProducts = (category) => {
    const categoryProducts = products.filter(product => product.category === category);
    const sortBy = categoryProductSort[category]?.sortBy || 'name';
    const sortOrder = categoryProductSort[category]?.sortOrder || 'asc';
    
    return categoryProducts.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Update category product sorting
  const updateCategorySort = (category, sortBy, sortOrder) => {
    setCategoryProductSort(prev => ({
      ...prev,
      [category]: { sortBy, sortOrder }
    }));
  };

  return (
    <div className="container mx-auto pt-44 pb-40">
      {/* Tabs */}
      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <button
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'addProduct' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('addProduct')}
          >
            Add Product
          </button>
          <button
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'manageProducts' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('manageProducts')}
          >
            Manage Products
          </button>
          <button
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'viewOrders' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('viewOrders')}
          >
            View Orders
          </button>
          <button
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Add Product */}
      {activeTab === 'addProduct' && <AddProduct onProductAdded={fetchProducts} />}

      {/* Manage Products */}
      {activeTab === 'manageProducts' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
          
          {/* Product Controls */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="font-medium text-sm">Category:</label>
              <select
                value={productFilterCategory}
                onChange={(e) => setProductFilterCategory(e.target.value)}
                className="border p-2 rounded w-full"
              >
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="font-medium text-sm">Sort by:</label>
              <select
                value={productSortBy}
                onChange={(e) => setProductSortBy(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="category">Category</option>
              </select>
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="font-medium text-sm">Order:</label>
              <select
                value={productSortOrder}
                onChange={(e) => setProductSortOrder(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-left">Price</th>
                  <th className="border border-gray-300 p-2 text-left">Category</th>
                  <th className="border border-gray-300 p-2 text-left">Featured</th>
                  <th className="border border-gray-300 p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortProducts(products).map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{product.name}</td>
                    <td className="border border-gray-300 p-2">Ksh{product.price}</td>
                    <td className="border border-gray-300 p-2">{product.category}</td>
                    <td className="border border-gray-300 p-2">
                      {product.featured ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Yes</span>
                      ) : (
                        <span className="text-gray-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                <label className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    checked={!!editData.featured}
                    onChange={(e) => setEditData({ ...editData, featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <span>Featured (show on landing page)</span>
                </label>
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
                      {order.name} - Ksh{order.totalAmount}
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

      {/* Reports */}
      {activeTab === 'reports' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
          
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Products</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Orders</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">Pending Orders</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Total Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">Ksh{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Products by Category */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Products by Category</h3>
            <div className="bg-white p-4 rounded-lg border">
              <div className="space-y-2">
                {Object.entries(stats.categoryStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="border border-gray-200 rounded-lg">
                      {/* Category Header */}
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleCategoryExpansion(category)}
                      >
                        <div className="flex items-center space-x-3">
                          <button className="flex items-center">
                            <svg 
                              className={`w-4 h-4 transition-transform ${expandedCategories[category] ? 'rotate-90' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <span className="font-medium text-gray-800">{category}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{count} items</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {((count / stats.totalProducts) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Expanded Product List */}
                      {expandedCategories[category] && (
                        <div className="border-t border-gray-200 p-4">
                          {/* Category Product Controls */}
                          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col space-y-1">
                              <label className="text-xs font-medium text-gray-600">Sort by:</label>
                              <select
                                value={categoryProductSort[category]?.sortBy || 'name'}
                                onChange={(e) => updateCategorySort(category, e.target.value, categoryProductSort[category]?.sortOrder || 'asc')}
                                className="border border-gray-300 p-2 rounded text-sm w-full"
                              >
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                              </select>
                            </div>
                            
                            <div className="flex flex-col space-y-1">
                              <label className="text-xs font-medium text-gray-600">Order:</label>
                              <select
                                value={categoryProductSort[category]?.sortOrder || 'asc'}
                                onChange={(e) => updateCategorySort(category, categoryProductSort[category]?.sortBy || 'name', e.target.value)}
                                className="border border-gray-300 p-2 rounded text-sm w-full"
                              >
                                <option value="asc">A-Z / Low-High</option>
                                <option value="desc">Z-A / High-Low</option>
                              </select>
                            </div>
                          </div>

                          {/* Products Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 text-sm">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-300 p-2 text-left">Product Name</th>
                                  <th className="border border-gray-300 p-2 text-left">Price (Ksh)</th>
                                  <th className="border border-gray-300 p-2 text-left">Quantity Scale</th>
                                  <th className="border border-gray-300 p-2 text-left">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getCategoryProducts(category).map((product) => (
                                  <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2 font-medium">{product.name}</td>
                                    <td className="border border-gray-300 p-2">{product.price}</td>
                                    <td className="border border-gray-300 p-2">{product.quantityScale || '-'}</td>
                                    <td className="border border-gray-300 p-2 max-w-xs truncate" title={product.description}>
                                      {product.description || '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Order Management with Filters */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Order Management</h3>
            
            {/* Order Controls */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-sm">Status:</label>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-sm">Sort by:</label>
                <select
                  value={orderSortBy}
                  onChange={(e) => setOrderSortBy(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="createdAt">Date</option>
                  <option value="totalAmount">Amount</option>
                  <option value="name">Customer Name</option>
                </select>
              </div>
              
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-sm">Order:</label>
                <select
                  value={orderSortOrder}
                  onChange={(e) => setOrderSortOrder(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg border overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Customer</th>
                    <th className="border border-gray-300 p-2 text-left">Amount</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                    <th className="border border-gray-300 p-2 text-left">Date</th>
                    <th className="border border-gray-300 p-2 text-left">Location</th>
                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortOrders(orders).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">{order.name}</td>
                      <td className="border border-gray-300 p-2">Ksh{order.totalAmount}</td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          order.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 p-2">{order.location}</td>
                      <td className="border border-gray-300 p-2">
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => markAsComplete(order._id)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
