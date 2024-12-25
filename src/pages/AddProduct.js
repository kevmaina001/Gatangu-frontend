import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const getFinalImageURL = (imagePath) => {
    if (!imagePath) return '/fallback.jpg'; // Fallback for missing image

    // If the imagePath is a full Cloudinary URL, return it directly
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Handle other cases where imagePath may not be fully qualified
    const baseURL =
      window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://gatangu-backend-1.onrender.com';
    const cleanedPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    return `${baseURL}/${cleanedPath}`;
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const fetchedProduct = response.data;

        // Debugging
        console.log('Fetched Product:', fetchedProduct);

        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err);
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

  const finalImageURL = getFinalImageURL(product.image);

  return (
    <div className="container mx-auto font-['Poppins'] pt-[15rem] pb-60 bg-white px-4 md:px-12">
      <ToastContainer />

      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img
              src={finalImageURL}
              alt={product.name}
              className="w-full object-contain p-4"
              style={{ height: '200px' }}
              onError={(e) => {
                console.error('Image failed to load:', finalImageURL);
                e.target.src = '/fallback.jpg'; // Use fallback image
              }}
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 md:pl-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <p className="text-gray-700 text-lg font-semibold mb-4">
            Price: <span className="text-blue-600">Ksh. {product.price.toFixed(2)}</span>
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

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
