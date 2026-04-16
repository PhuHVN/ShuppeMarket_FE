import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = useCallback((count) => {
    setCartCount(count);
  }, []);

  const incrementCartCount = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  const decrementCartCount = useCallback(() => {
    setCartCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = {
    cartCount,
    setCartCount,
    updateCartCount,
    incrementCartCount,
    decrementCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
