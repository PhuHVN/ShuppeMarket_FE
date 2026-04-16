import React, { createContext, useState, useContext, useEffect } from "react";
import { authService, sellerService, categoryService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null); // Seller info
  const [categories, setCategories] = useState([]); // All categories
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Nếu có token, fetch profile từ /auth/me
      fetchCurrentUser();
    } else {
      setLoading(false);
    }

    // Fetch categories on app load
    fetchCategories();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      const userData = response.data.data;

      setUser(userData);
      setIsAuthenticated(true);

      // Lưu user data vào localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Fetch seller info nếu là seller
      if (userData.role?.toUpperCase() === "SELLER") {
        await fetchSellerInfo(userData.id);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerInfo = async (accountId) => {
    try {
      // Fetch seller info using account ID
      const response = await sellerService.getSellerByAccountId(accountId);
      setSeller(response.data.data);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories(1, 100);
      if (response?.data?.data?.items) {
        setCategories(response.data.data.items);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { accessToken, token, refreshToken, ...userData } =
      response.data.data;

    // Store token - axios interceptor sẽ automatically thêm vào header
    localStorage.setItem("token", accessToken || token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Set authenticated untuk axios interceptor có token
    setIsAuthenticated(true);

    // Fetch full user profile từ /auth/me với token vừa lưu
    await fetchCurrentUser();

    return response.data.data;
  };

  const register = async (email, password, fullName, phone) => {
    const response = await authService.register(
      email,
      password,
      fullName,
      phone,
    );
    return response.data;
  };

  const verifyOtp = async (email, otp) => {
    const response = await authService.verifyOtp(email, otp);
    return response.data;
  };

  const registerAsSeller = async (accountId, sellerData) => {
    try {
      const response = await sellerService.registerSeller(
        accountId,
        sellerData,
      );
      // Update user role to Seller with Pending status
      setUser((prev) => ({
        ...prev,
        role: "Seller",
        status: "Pending",
      }));
      setSeller(response.data.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("user");
    setUser(null);
    setSeller(null);
    setIsAuthenticated(false);
  };

  // Helper functions
  const isAdmin = () => user?.role?.toUpperCase() === "ADMIN";
  const isSeller = () => user?.role?.toUpperCase() === "SELLER";
  const isSellerActive = () =>
    isSeller() && user?.status?.toUpperCase() === "ACTIVE";
  const isSellerPending = () =>
    isSeller() && user?.status?.toUpperCase() === "PENDING";

  return (
    <AuthContext.Provider
      value={{
        user,
        seller,
        categories,
        loading,
        isAuthenticated,
        login,
        register,
        verifyOtp,
        registerAsSeller,
        logout,
        fetchCurrentUser,
        fetchSellerInfo,
        fetchCategories,
        // Helper methods
        isAdmin,
        isSeller,
        isSellerActive,
        isSellerPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
