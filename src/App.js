import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components (keep these as regular imports for immediate loading)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import PWAInstallPrompt from './components/PWAInstallPrompt';
// import PWATestButton from './components/PWATestButton'; // Uncomment for testing

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Profile = React.lazy(() => import('./pages/Profile'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const AddProduct = React.lazy(() => import('./pages/AddProduct'));
const PasswordRecovery = React.lazy(() => import('./pages/PasswordRecovery'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const CategoryProducts = React.lazy(() => import('./pages/CategoryProducts'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const ProductList = React.lazy(() => import('./pages/ProductList'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-secondary-600 font-medium">Loading...</p>
    </div>
  </div>
);

const App = () => {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route path="/password-recovery" element={<PasswordRecovery />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/category/:categoryName" element={<CategoryProducts />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/shop" element={<ProductList />} />

                  {/* Protected/Admin Routes */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin-panel" element={<AdminPanel />} />
                  <Route path="/add-product" element={<AddProduct />} />
                </Routes>
              </Suspense>
            </main>

            {/* Footer */}
            <Footer />
            
            {/* Bottom Navigation - Mobile Only */}
            <BottomNavigation />
            
            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
            
            {/* PWA Test Button - Uncomment for testing */}
            {/* <PWATestButton /> */}
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
