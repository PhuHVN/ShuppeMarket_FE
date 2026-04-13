import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  BarChart3,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/api";

const Header = () => {
  const { user, isAuthenticated, logout, isSeller, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await productService.getAllProducts(1, 5, searchQuery);
        const items = response.data.data.items || [];
        setSuggestions(items);
        setShowSuggestions(items.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?searchTerm=${searchQuery}`);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      setMobileOpen(false);
    }
  };

  const handleSuggestionClick = (productId, productName) => {
    navigate(`/products?searchTerm=${productName}`);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 text-xs text-gray-600 flex justify-between items-center">
          <div className="space-x-4 hidden md:flex">
            <span className="text-gray-500">Theo dõi chúng tôi:</span>
            <a
              href="#"
              className="hover:text-shopee-500 transition font-medium"
            >
              Facebook
            </a>
            <a
              href="#"
              className="hover:text-shopee-500 transition font-medium"
            >
              Instagram
            </a>
          </div>
          {!isAuthenticated ? (
            <div className="space-x-3 ml-auto">
              <Link
                to="/login"
                className="hover:text-shopee-500 transition font-medium"
              >
                Đăng nhập
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/register"
                className="hover:text-shopee-500 transition font-medium"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3 ml-auto">
              <User size={14} className="text-gray-400" />
              <span className="text-gray-900 font-medium">
                {user?.fullName || user?.email}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {user?.role || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="hover:text-shopee-500 transition flex items-center gap-1"
              >
                <LogOut size={14} />
                Thoát
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-shopee sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0 group"
            >
              <div className="bg-shopee-500 text-white text-2xl font-bold w-10 h-10 rounded flex items-center justify-center group-hover:bg-shopee-600 transition">
                S
              </div>
              <span className="hidden sm:inline text-lg font-bold text-shopee-500">
                ShuppeMarket
              </span>
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 min-w-0 hidden sm:block mx-4"
              ref={searchRef}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                  placeholder="Tìm kiếm sản phẩm, danh mục..."
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shopee-500 focus:border-transparent transition text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-shopee-500 text-white p-2 rounded-md hover:bg-shopee-600 transition"
                  title="Tìm kiếm"
                >
                  <Search size={18} />
                </button>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(product.id, product.name)
                        }
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 border-b border-gray-100 last:border-0 transition text-left"
                      >
                        {/* Product Image */}
                        <img
                          src={product.imageUrl || "/placeholder.png"}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-shopee-500 font-semibold">
                            ₫{product.price?.toLocaleString("vi-VN") || "0"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                title="Giỏ hàng"
              >
                <ShoppingCart size={22} className="text-gray-700" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Profile Avatar Button */}
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/profile")}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition group"
                  title="Hồ sơ cá nhân"
                >
                  <div className="w-7 h-7 bg-shopee-500 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-shopee-600 transition">
                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                </button>
              )}

              {/* Admin/Seller Dashboard Link */}
              {isAuthenticated && isAdmin() && (
                <Link
                  to="/admin/dashboard"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-sm font-medium text-gray-700"
                >
                  <BarChart3 size={18} />
                  Admin
                </Link>
              )}

              {isAuthenticated && isSeller() && (
                <Link
                  to="/seller/dashboard"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-sm font-medium text-gray-700"
                >
                  <BarChart3 size={18} />
                  Dashboard
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="sm:hidden mt-3"
            ref={searchRef}
          >
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                placeholder="Tìm kiếm..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-shopee-500 transition"
              />
              <button
                type="submit"
                className="bg-shopee-500 text-white px-3 py-2 rounded-lg hover:bg-shopee-600 transition"
              >
                <Search size={18} />
              </button>

              {/* Mobile Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() =>
                        handleSuggestionClick(product.id, product.name)
                      }
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 border-b border-gray-100 last:border-0 transition text-left"
                    >
                      <img
                        src={product.imageUrl || "/placeholder.png"}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-shopee-500 font-semibold">
                          ₫{product.price?.toLocaleString("vi-VN") || "0"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow">
          <nav className="px-4 py-4 space-y-2">
            <Link
              to="/products"
              className="block px-4 py-2.5 rounded-lg hover:bg-shopee-50 text-shopee-600 font-medium transition"
              onClick={() => setMobileOpen(false)}
            >
              📦 Danh sách sản phẩm
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2.5 rounded-lg hover:bg-gray-100 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  👤 Tài khoản của tôi
                </Link>

                {!isSeller() && (
                  <Link
                    to="/seller/register"
                    className="block px-4 py-2.5 rounded-lg hover:bg-gray-100 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    🏪 Trở thành người bán
                  </Link>
                )}

                {isSeller() && (
                  <Link
                    to="/seller/dashboard"
                    className="block px-4 py-2.5 rounded-lg bg-shopee-50 text-shopee-600 font-medium transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    📊 Bảng điều khiển bán hàng
                  </Link>
                )}

                {isAdmin() && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    ⚙️ Quản lý Admin
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
