import React, { useState } from 'react';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    quantityScale: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imagePreview, setImagePreview] = useState(null); // For displaying the selected image

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductData({ ...productData, image: file });

    // Image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('quantityScale', productData.quantityScale);
    formData.append('description', productData.description);
    formData.append('image', productData.image);

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        setMessage({ text: 'Product added successfully!', type: 'success' });
        setProductData({
          name: '',
          price: '',
          category: '',
          quantityScale: '',
          description: '',
          image: null,
        });
        setImagePreview(null);
      } else {
        setMessage({ text: `Failed to add product: ${data.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'A network error occurred. Please try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-32">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      {/* Display success/error messages */}
      {message.text && (
        <div
          className={`p-4 mb-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="" disabled>Select a category</option>
            {['Airtime', 'Animal Feeds', 'Bakery', 'Medicine', 'Groceries', 'Hardware'].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantityScale" className="block text-gray-700">Quantity Scale</label>
          <select
            id="quantityScale"
            name="quantityScale"
            value={productData.quantityScale}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="" disabled>Select a scale</option>
            <option value="Kg">Kg</option>
            <option value="Grams">Grams</option>
            <option value="Litres">Litres</option>
            <option value="Packets">Packets</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            rows="3"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-gray-700">Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="text-gray-600">Image Preview:</p>
              <img src={imagePreview} alt="Selected" className="h-32 w-auto mt-2" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`px-6 py-2 rounded-md ${loading ? 'bg-gray-400' : 'bg-yellow-500 text-white'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
