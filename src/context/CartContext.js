import React, { createContext, useContext, useState } from 'react';

// Create the CartContext
export const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component to wrap the app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add to cart logic
  const addToCart = (product, quantity) => {
    const existingProduct = cart.find((item) => item._id === product._id); // Use `_id` to uniquely identify products
    if (existingProduct) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity }]);
    }
  };

  // Remove from cart logic
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Update quantity logic
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId); // Remove item if quantity is less than 1
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Clear cart logic
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
