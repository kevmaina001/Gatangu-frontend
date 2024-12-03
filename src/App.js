import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading pages
const Home = React.lazy(() => import('./pages/Home'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const CategoryProducts = React.lazy(() => import('./pages/CategoryProducts'));
const AddProduct = React.lazy(() => import('./pages/AddProduct'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-center">
      <img
        src="/images/logo.jpg" // Path to the logo
        alt="Loading..."
        className="mx-auto mb-4"
        style={{ width: '150px', height: '150px' }} // Enlarge logo dimensions
      />
      <p className="text-gray-600 text-lg font-medium">Loading...</p>
    </div>
  </div>
);


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
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
              </Suspense>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
