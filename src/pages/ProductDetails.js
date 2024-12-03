import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext'; // Import the CartContext
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart(); // Access the addToCart function
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Quantity state

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No product found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-52 py-10 bg-white px-4 md:px-12">
      {/* Toast Container */}
      <ToastContainer />

      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* Scaled-Down Product Image */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img
              src={`https://gatangu-backend-1.onrender.com/${product.image}`} // Ensure proper path for image
              alt={product.name}
              className="w-full object-contain p-4"
              style={{ height: '200px' }} // Reduced height for scaling
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-2/3 md:pl-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <p className="text-gray-700 text-lg font-semibold mb-4">
            Price: <span className="text-blue-600">Ksh. {product.price.toFixed(2)}</span>
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Quantity Input */}
          <div className="flex items-center space-x-4 mb-6">
            <label htmlFor="quantity" className="text-gray-700 font-medium">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = Math.max(1, Number(e.target.value));
                if (!isNaN(value)) setQuantity(value);
              }}
              className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-gray-700"
              min="1"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
