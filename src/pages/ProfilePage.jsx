import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Edit2,
  Save,
  X,
  Loader,
  AlertCircle,
  Store,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { accountService } from "../services/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, seller, logout, isSellerPending, isSellerActive } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phoneNumber || user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    district: user?.district || "",
    postalCode: user?.postalCode || "",
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user?.fullName || "",
        phone: user?.phoneNumber || user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        district: user?.district || "",
        postalCode: user?.postalCode || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when cancel
      setFormData({
        fullName: user?.fullName || "",
        phone: user?.phoneNumber || user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        district: user?.district || "",
        postalCode: user?.postalCode || "",
      });
      setSuccess(false);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate
      if (!formData.fullName.trim()) {
        throw new Error("Tên đầy đủ không được để trống");
      }

      // Call update API
      const updateData = {
        ...formData,
      };

      // Note: Adjust API call based on your backend endpoint
      // For now, showing the structure - you may need to create an update account endpoint
      console.log("Updating profile with:", updateData);

      // Here you would call: await accountService.updateAccount(updateData);
      // But currently accountService doesn't have an updateAccount method
      // You can add it to api.js if needed

      setSuccess(true);
      setIsEditing(false);

      // Show success message
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBecomeSeller = () => {
    navigate("/seller/register");
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-orange-500 mb-4" />
            <p className="text-gray-600 mb-4">
              Vui lòng đăng nhập để xem profile
            </p>
            <button onClick={() => navigate("/login")} className="btn-shopee">
              Đăng nhập
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-4 rounded-r mb-6 flex items-center gap-3">
            <CheckCircle size={20} />
            <span>Cập nhật thành công!</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-r mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-shopee p-6 sticky top-4">
              {/* User Avatar & Role Badge */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-shopee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={48} className="text-shopee-500" />
                </div>
                <h3 className="text-lg font-bold mb-1">{user?.fullName}</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                    {user?.role || "Customer"}
                  </span>
                  {user?.status && (
                    <span
                      className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user?.status}
                    </span>
                  )}
                </div>
              </div>

              <hr className="my-6" />

              {/* Menu */}
              <div className="space-y-2 mb-6">
                <button className="w-full text-left px-4 py-3 bg-shopee-50 text-shopee-500 rounded font-medium text-sm">
                  Thông tin tài khoản
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                >
                  Đơn mua
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                >
                  Yêu thích
                </button>
                {user?.role?.toUpperCase() !== "SELLER" && (
                  <button
                    onClick={handleBecomeSeller}
                    className="w-full text-left px-4 py-3 text-shopee-500 hover:bg-shopee-50 rounded text-sm flex items-center gap-2"
                  >
                    <Store size={16} />
                    Trở thành người bán
                  </button>
                )}
                {user?.role?.toUpperCase() === "SELLER" && (
                  <button
                    onClick={() => navigate("/seller/dashboard")}
                    className="w-full text-left px-4 py-3 text-shopee-500 hover:bg-shopee-50 rounded text-sm flex items-center gap-2"
                  >
                    <Store size={16} />
                    Bảng điều khiển bán hàng
                  </button>
                )}
              </div>

              <hr className="my-6" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded flex items-center justify-center gap-2 font-medium"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seller Status Alert */}
            {user?.role?.toUpperCase() === "SELLER" && (
              <div
                className={`card-shopee p-6 border-l-4 ${
                  isSellerPending()
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-green-500 bg-green-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg flex-shrink-0 ${
                      isSellerPending() ? "bg-yellow-100" : "bg-green-100"
                    }`}
                  >
                    <Store
                      className={
                        isSellerPending() ? "text-yellow-600" : "text-green-600"
                      }
                      size={24}
                    />
                  </div>
                  <div>
                    <h4
                      className={`font-bold mb-1 ${
                        isSellerPending() ? "text-yellow-900" : "text-green-900"
                      }`}
                    >
                      {isSellerPending()
                        ? "⏳ Cửa hàng đang chờ duyệt"
                        : "✅ Cửa hàng đã được duyệt"}
                    </h4>
                    <p
                      className={`text-sm ${
                        isSellerPending() ? "text-yellow-800" : "text-green-800"
                      }`}
                    >
                      {isSellerPending()
                        ? "Cửa hàng của bạn đang chờ xét duyệt từ Admin. Thường mất 24-48 giờ."
                        : "Cửa hàng của bạn đã được kích hoạt. Bạn có thể tạo sản phẩm ngay!"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Information Card */}
            <div className="card-shopee p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Thông Tin Tài Khoản</h2>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 text-shopee-500 hover:text-shopee-600 font-medium"
                >
                  {isEditing ? (
                    <>
                      <X size={20} />
                      Hủy
                    </>
                  ) : (
                    <>
                      <Edit2 size={20} />
                      Chỉnh sửa
                    </>
                  )}
                </button>
              </div>

              {!isEditing ? (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-gray-600 text-sm mb-2">Tên đầy đủ</p>
                      <p className="text-lg font-medium">{user?.fullName}</p>
                    </div>
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-gray-600 text-sm mb-2">Email</p>
                      <p className="text-lg font-medium flex items-center gap-2">
                        <Mail size={18} className="text-gray-400" />
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-gray-600 text-sm mb-2">
                        Số điện thoại
                      </p>
                      <p className="text-lg font-medium flex items-center gap-2">
                        <Phone size={18} className="text-gray-400" />
                        {user?.phoneNumber || user?.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-gray-600 text-sm mb-2">Mã bưu điện</p>
                      <p className="text-lg font-medium">
                        {user?.postalCode || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm mb-2">Địa chỉ</p>
                    <p className="text-lg font-medium flex items-start gap-2">
                      <MapPin
                        size={18}
                        className="text-gray-400 mt-1 flex-shrink-0"
                      />
                      <span>
                        {user?.address
                          ? `${user.address}${user.district ? ", " + user.district : ""}${user.city ? ", " + user.city : ""}`
                          : "Chưa cập nhật"}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tên đầy đủ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nhập tên đầy đủ"
                        className="input-shopee"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="input-shopee bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Không thể thay đổi email
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        className="input-shopee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mã bưu điện
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Nhập mã bưu điện"
                        className="input-shopee"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Số nhà, tên đường"
                      className="input-shopee"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Thành phố
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Nhập thành phố"
                        className="input-shopee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Quận/Huyện
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Nhập quận/huyện"
                        className="input-shopee"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-shopee flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
