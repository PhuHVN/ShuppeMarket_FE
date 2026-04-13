import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-shopee-500 to-shopee-600 text-white text-5xl font-bold w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
              S
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ShuppeMarket
            </h1>
            <p className="text-gray-500">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Login Form Card */}
          <div className="card-shopee p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-r mb-6 flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email hoặc SĐT
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="input-shopee pl-11"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-shopee pl-11"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-shopee-500 focus:ring-shopee-500"
                  />
                  <span className="text-gray-600">Ghi nhớ tôi</span>
                </label>
                <a
                  href="#"
                  className="text-shopee-500 hover:text-shopee-600 font-medium transition"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-shopee flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                  hoặc
                </span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full border-2 border-gray-200 py-2.5 rounded-lg font-medium text-gray-700 hover:border-shopee-500 hover:text-shopee-500 hover:bg-shopee-50 transition mb-4"
            >
              🔍 Đăng nhập với Google
            </button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-600 mt-8 pt-6 border-t border-gray-100">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-shopee-500 font-semibold hover:text-shopee-600 transition"
              >
                Đăng ký ngay
              </Link>
              <p className="text-xs text-gray-500 mt-3">
                Bằng cách đăng nhập, bạn đồng ý với điều khoản &amp; điều lệ của
                chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
