// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Import CartProvider once
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CategoryProducts from './pages/CategoryProducts';
import AddProduct from './pages/AddProduct';
import SearchResults from './pages/SearchResults';

const App = () => {
  return (
    <Router>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <CartProvider> {/* Wrap with CartProvider */}
          <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />
            <main className="flex-grow">
              {/* Routes */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/category/:categoryName" element={<CategoryProducts />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/search" element={<SearchResults />} />

              </Routes>
            </main>
            {/* Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
