import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Critical components (Eagerly loaded)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Lazy-loaded non-critical pages
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
        style={{ width: '150px', height: '150px' }} // Logo dimensions
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
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Eagerly loaded pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />

                  {/* Lazy-loaded pages */}
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route path="/category/:categoryName" element={<CategoryProducts />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/search" element={<SearchResults />} />
                </Routes>
              </Suspense>
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
