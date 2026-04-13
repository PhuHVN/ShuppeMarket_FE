import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterSellerPage from "./pages/RegisterSellerPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer/User Routes */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Seller Routes */}
          <Route path="/seller/register" element={<RegisterSellerPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route
            path="/seller/products/create"
            element={<ProductManagementPage />}
          />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
