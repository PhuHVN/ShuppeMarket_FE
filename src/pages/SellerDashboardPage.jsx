import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Clock, Plus, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { sellerService, productService } from "../services/api";

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isSeller, isSellerActive, isSellerPending, seller } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSeller()) {
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [isSeller]);

  const fetchDashboardData = async () => {
    try {
      // Fetch seller's products
      const prodResponse = await productService.getAllProducts(1, 10);
      setProducts(prodResponse.data.data.items || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSeller()) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-orange-500 mb-4" />
            <p className="text-gray-600 mb-4">Bạn không phải là seller</p>
            <button
              onClick={() => navigate("/seller/register")}
              className="btn-shopee"
            >
              Đăng ký bán hàng
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bảng điều khiển bán hàng
          </h1>
          <p className="text-gray-600">Quản lý cửa hàng và sản phẩm của bạn</p>
        </div>

        {/* Status Alert */}
        {isSellerPending() && (
          <div className="card-shopee p-6 mb-8 border-l-4 border-yellow-500 bg-yellow-50">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-900 mb-1">
                  ⏳ Cửa hàng đang chờ duyệt
                </h3>
                <p className="text-yellow-800 mb-4">
                  Cửa hàng của bạn đang chRepositorywaitidng verify từ Admin.
                  Thường mất 24-48 giờ. Bạn sẽ được thông báo qua email khi được
                  duyệt.
                </p>
                <div className="bg-white/50 p-3 rounded text-sm text-yellow-900">
                  <strong>Tiến trình:</strong> Admin đang xem xét thông tin cửa
                  hàng của bạn...
                </div>
              </div>
            </div>
          </div>
        )}

        {isSellerActive() && (
          <div className="card-shopee p-6 mb-8 border-l-4 border-green-500 bg-green-50">
            <div className="flex items-start gap-4 justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900 mb-1">
                    ✅ Cửa hàng đã được duyệt!
                  </h3>
                  <p className="text-green-800">
                    Chúc mừng! Cửa hàng của bạn đã được kích hoạt. Bây giờ bạn
                    có thể thêm sản phẩm và bắt đầu bán hàng.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/seller/products/create")}
                className="btn-shopee flex items-center gap-2 whitespace-nowrap ml-4"
              >
                <Plus size={18} />
                Thêm sản phẩm
              </button>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Sản phẩm của bạn
            </h2>
            {isSellerActive() && (
              <button
                onClick={() => navigate("/seller/products/create")}
                className="btn-shopee flex items-center gap-2"
              >
                <Plus size={18} />
                Thêm sản phẩm mới
              </button>
            )}
          </div>

          {loading ? (
            <div className="card-shopee p-8 text-center">
              <p className="text-gray-500">Đang tải...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="card-shopee p-8 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">Chưa có sản phẩm nào</p>
              {isSellerActive() && (
                <button
                  onClick={() => navigate("/seller/products/create")}
                  className="btn-shopee"
                >
                  Tạo sản phẩm đầu tiên
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="card-shopee p-4 hover:shadow-lg transition"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={
                        product.imageUrl || "https://via.placeholder.com/200"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-shopee-500 font-bold mb-2">
                    {product.price?.toLocaleString()}đ
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Tồn kho: {product.quantity}
                  </p>
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="w-full btn-shopee-outline text-sm"
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="mt-8 card-shopee p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Thông tin cửa hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tên cửa hàng</p>
              <p className="text-gray-900 font-medium">
                {seller?.shopName || user?.fullName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              <div className="flex items-center gap-2">
                {isSellerPending() && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-900 font-medium">Chờ duyệt</span>
                  </>
                )}
                {isSellerActive() && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-900 font-medium">Hoạt động</span>
                  </>
                )}
              </div>
            </div>
            {seller?.description && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Mô tả</p>
                <p className="text-gray-900">{seller.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerDashboardPage;
