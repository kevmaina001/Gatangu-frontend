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

  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('quantityScale', productData.quantityScale);
    formData.append('description', productData.description);
    formData.append('image', productData.image);

    try {
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('Product added successfully');
        setProductData({
          name: '',
          price: '',
          category: '',
          quantityScale: '',
          description: '',
          image: null,
        });
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the product');
    }
  };

  return (
    <div className="container mx-auto pt-32">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
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
            {[
              'Airtime',
              'Animal Feeds',
              'Animal Health',
              'Baby Hygiene',
              'Bakery',
              'Beverages',
              'Cereals & Ext.',
              'Cigarettes',
              'Confectionery',
              'Display Dept',
              'Farm Inputs',
              'Fats & Oils',
              'Flour & Rice',
              'Food Additives',
              'Groceries',
              'Hardware',
              'Household',
              'Lighters',
              'Lightings',
              'Medicine',
              'Milk',
              'Packaging',
              'Personal Care',
              'Spreads',
              'Stationery',
              'Warehouse',
              'Wholesale',
            ].map((category) => (
              <option key={category} value={category}>{category}</option>
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
            required
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
            required
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
        </div>
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
