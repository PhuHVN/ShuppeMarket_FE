import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Upload, X, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { productService } from "../services/api";

const ProductManagementPage = () => {
  const navigate = useNavigate();
  const { isSellerActive, isSellerPending, categories } = useAuth();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (!isSellerActive()) {
      navigate("/seller/dashboard");
      return;
    }
  }, [isSellerActive, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.name.trim()) {
        throw new Error("Tên sản phẩm không được để trống");
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error("Giá sản phẩm không hợp lệ");
      }
      if (!formData.quantity || parseInt(formData.quantity) <= 0) {
        throw new Error("Số lượng sản phẩm không hợp lệ");
      }
      if (selectedCategories.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một danh mục");
      }
      if (!formData.image) {
        throw new Error("Vui lòng chọn hình ảnh sản phẩm");
      }

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description || "");
      submitData.append("price", parseFloat(formData.price));
      submitData.append("quantity", parseInt(formData.quantity));
      submitData.append("image", formData.image);

      // Add category IDs
      selectedCategories.forEach((catId) => {
        submitData.append("categoryIds", catId);
      });

      // Call API
      const response = await productService.createProduct(submitData);

      setSuccess(true);
      setTimeout(() => {
        navigate("/seller/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Tạo sản phẩm thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSellerPending()) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
          <div className="card-shopee p-8 max-w-md text-center">
            <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Cựa hàng chưa được duyệt
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chỉ có thể tạo sản phẩm khi cửa hàng đã được Admin duyệt. Vui
              lòng chờ...
            </p>
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="btn-shopee"
            >
              Quay lại Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thêm sản phẩm mới
          </h1>
          <p className="text-gray-600">
            Điền thông tin chi tiết về sản phẩm của bạn
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
              <div className="text-sm">
                <p className="font-semibold mb-1">
                  ✅ Tạo sản phẩm thành công!
                </p>
                <p>
                  Sản phẩm của bạn đã được thêm. Chuyển hướng về dashboard...
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Thông tin cơ bản
              </h3>

              <div className="space-y-4">
                {/* Tên sản phẩm */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ví dụ: iPhone 15 Pro Max"
                    className="input-shopee"
                    required
                  />
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Nêu chi tiết về sản phẩm, đặc điểm, tính năng..."
                    className="input-shopee h-24 resize-none"
                    rows={4}
                  />
                </div>

                {/* Giá & Số lượng */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giá (VNĐ) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="100000"
                      className="input-shopee"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số lượng *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="10"
                      className="input-shopee"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hình ảnh */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Hình ảnh sản phẩm
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-shopee-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="product-image"
                  required
                />

                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 max-w-xs object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="product-image" className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-700 font-medium mb-1">
                      Chọn hoặc kéo hình ảnh vào đây
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF (tối đa 5MB)
                    </p>
                  </label>
                )}
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Danh mục sản phẩm
              </h3>

              {categories.length === 0 ? (
                <p className="text-gray-600 text-sm">Đang tải danh mục...</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-shopee-500 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 text-shopee-500 rounded focus:ring-shopee-500"
                      />
                      <span className="ml-2 text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Chọn ít nhất một danh mục
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/seller/dashboard")}
                className="flex-1 btn-shopee-outline"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 btn-shopee disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Tạo sản phẩm
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductManagementPage;
