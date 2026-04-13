import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, CheckCircle, AlertCircle, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";

const RegisterSellerPage = () => {
  const navigate = useNavigate();
  const { user, registerAsSeller } = useAuth();

  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    logoUrl: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-gray-600">
              Vui lòng đăng nhập để đăng ký bán hàng
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 btn-shopee"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.shopName.trim()) {
        throw new Error("Tên cửa hàng không được để trống");
      }
      if (!formData.address.trim()) {
        throw new Error("Địa chỉ cửa hàng không được để trống");
      }

      // Call API
      const response = await registerAsSeller(user.id, formData);

      setSuccess(true);
      setTimeout(() => {
        navigate("/seller/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Đăng ký thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-shopee-500 to-shopee-600 text-white w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Store size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng ký bán hàng
            </h1>
            <p className="text-gray-500">
              Bắt đầu kinh doanh trên ShuppeMarket ngay hôm nay
            </p>
          </div>

          {/* Form Card */}
          <div className="card-shopee p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-r mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-4 rounded-r mb-6 flex items-start gap-3">
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">✅ Đăng ký thành công!</p>
                  <p>
                    Cửa hàng của bạn đang chờ duyệt từ Admin. Vui lòng chờ...
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tên Cửa Hàng */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên cửa hàng *
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Ví dụ: Cửa hàng của tôi"
                  className="input-shopee"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tên cửa hàng sẽ hiển thị trên tất cả sản phẩm của bạn
                </p>
              </div>

              {/* Mô Tả Cửa Hàng */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả cửa hàng
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nêu những điểm mạnh, chuyên môn, hoặc nội dung khác về cửa hàng của bạn..."
                  className="input-shopee h-24 resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Giúp khách hàng hiểu rõ hơn về cửa hàng của bạn
                </p>
              </div>

              {/* Địa Chỉ */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ cửa hàng *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ví dụ: 123 Đường Nguyễn Huệ, Q.1, TP. Hồ Chí Minh"
                  className="input-shopee"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Địa chỉ sẽ được sử dụng cho đơn hàng giao dịch
                </p>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo cửa hàng
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="input-shopee"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sử dụng URL ảnh (ví dụ: từ Cloudinary)
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-2 font-semibold">
                  ℹ️ Điều gì sẽ xảy ra tiếp theo?
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✅ Cửa hàng của bạn sẽ được gửi cho Admin xét duyệt</li>
                  <li>✅ Admin sẽ duyệt trong vòng 24-48 giờ</li>
                  <li>✅ Khi được duyệt, bạn có thể bắt đầu thêm sản phẩm</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full btn-shopee mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={18} />
                    Đăng ký thành công! Chuyển hướng...
                  </>
                ) : (
                  <>
                    <Store size={18} />
                    Đăng ký bán hàng
                  </>
                )}
              </button>
            </form>

            {/* Bottom Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <a href="#" className="text-shopee-500 hover:underline">
                  Điều khoản bán hàng
                </a>{" "}
                và{" "}
                <a href="#" className="text-shopee-500 hover:underline">
                  Chính sách cửa hàng
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterSellerPage;
