import React, { useState, useEffect } from "react";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { cartService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const { setCartCount } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem giỏ hàng");
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await cartService.getCart();
      setCart(response.data.data);
      setCartCount(response.data.data?.cartDetails?.length || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể tải giỏ hàng. Vui lòng thử lại.",
      );
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (detailId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await cartService.updateCartItem(detailId, newQuantity);
      await fetchCart();
    } catch (err) {
      setError("Lỗi cập nhật số lượng. Vui lòng thử lại.");
      console.error("Error updating quantity:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (detailId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      setUpdating(true);
      await cartService.removeFromCart(detailId);
      await fetchCart();
    } catch (err) {
      setError("Lỗi xóa sản phẩm. Vui lòng thử lại.");
      console.error("Error removing item:", err);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded shadow-shopee p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng nhập để xem giỏ hàng của mình
            </p>
            <Link to="/login" className="btn-shopee px-8 py-3 text-lg">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12">Đang tải giỏ hàng...</div>
        </div>
      </MainLayout>
    );
  }

  const items = cart?.cartDetails || [];
  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const shipping = 25000;
  const total = subtotal + shipping;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-shopee-500 hover:text-shopee-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded mb-6">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded shadow-shopee p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">
              Hãy thêm một số sản phẩm vào giỏ hàng của bạn
            </p>
            <Link to="/" className="btn-shopee px-8 py-3 text-lg">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded shadow-shopee overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.cartDetailId}
                    className="border-b border-gray-200 p-4 last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={
                            item.productImage ||
                            "https://via.placeholder.com/100x100?text=Product"
                          }
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Bán bởi:{" "}
                          <span className="text-shopee-500 font-medium">
                            {item.shopName}
                          </span>
                        </p>
                        <p className="text-shopee-500 font-bold text-lg">
                          {formatPrice(item.price)}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.cartDetailId,
                                item.quantity - 1,
                              )
                            }
                            disabled={updating}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.cartDetailId,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-12 text-center border border-gray-300 rounded py-1 text-sm"
                            min="1"
                            disabled={updating}
                          />
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.cartDetailId,
                                item.quantity + 1,
                              )
                            }
                            disabled={updating}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="font-bold text-lg text-gray-900">
                          {formatPrice(item.totalPrice)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.cartDetailId)}
                          disabled={updating}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded shadow-shopee p-6 sticky top-4">
                <h3 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h3>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Tổng cộng:</span>
                  <span className="text-shopee-500">{formatPrice(total)}</span>
                </div>

                <button className="w-full btn-shopee py-3 font-bold text-lg rounded mb-3">
                  Thanh toán ({items.length} sản phẩm)
                </button>
                <Link
                  to="/"
                  className="block text-center py-3 border border-shopee-500 text-shopee-500 font-bold rounded hover:bg-shopee-50 transition"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
