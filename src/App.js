import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AddProduct from './pages/AddProduct';
// import ManageOrders from './pages/ManageOrders';
// import ViewOrders from './pages/ViewOrders';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CategoryProducts from './pages/CategoryProducts';
import SearchResults from './pages/SearchResults';

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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/add-product" element={<AddProduct />} />
                {/* <Route path="/manage-orders" element={<ManageOrders />} />
                <Route path="/view-orders" element={<ViewOrders />} /> */}
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/category/:categoryName" element={<CategoryProducts />} />
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
