import React, { useState, useEffect } from "react";
import { Heart, Share2, Truck, Shield, Star, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import { productService, reviewService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await productService.getAllProducts(1, 5);
      setRelatedProducts(
        response.data.data.items?.filter((p) => p.id !== id) || [],
      );
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      // Get reviews for this specific product
      const response = await reviewService.getReviewsByProductId(id, 1, 100);
      const productReviews = response.data.data.items || [];
      setReviews(productReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddReview = async (productId, rating, comment) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewService.createReview(productId, rating, comment);
      setReviewSuccess("Đánh giá của bạn đã được thêm thành công!");
      // Refresh reviews
      await fetchReviews();
      // Clear success message after 3 seconds
      setTimeout(() => setReviewSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Có lỗi xảy ra khi thêm đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      // Refresh reviews
      await fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">Đang tải...</div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12 text-gray-500">
            Sản phẩm không được tìm thấy
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <span>Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="mx-2">{product.category || "Danh mục"}</span>
          <span className="mx-2">/</span>
          <span className="text-shopee-500 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Product Images */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="bg-white rounded shadow-shopee overflow-hidden mb-4">
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/400x400?text=Product"
                }
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[
                product.imageUrl,
                product.imageUrl,
                product.imageUrl,
                product.imageUrl,
              ].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded overflow-hidden border-2 ${
                    selectedImage === idx
                      ? "border-shopee-500"
                      : "border-gray-200"
                  } h-20`}
                >
                  <img
                    src={img || "https://via.placeholder.com/100x100"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded shadow-shopee p-6">
              {/* Product Name */}
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating || 4)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  ({product.reviews || 0} đánh giá)
                </span>
              </div>

              {/* Price Section */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-shopee-500">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price * 1.2)}
                  </span>
                </div>
                <p className="text-sm text-red-500 mt-2">
                  Tiết kiệm {formatPrice(product.price * 0.2)}
                </p>
              </div>

              {/* Seller Info */}
              <div className="bg-gray-50 rounded p-4 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {product.seller || "ShuppeMarket Official"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      ⭐ 4.8/5 đánh giá | 1.2K người theo dõi
                    </p>
                  </div>
                  <button className="btn-shopee-outline text-sm">
                    Theo dõi
                  </button>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📍 {product.location || "TP. Hồ Chí Minh"}</p>
                  <p>⏱️ Thời gian phản hồi: Trong vòng 24 giờ</p>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-3">
                  <Truck className="text-shopee-500 flex-shrink-0" size={20} />
                  <div className="text-sm">
                    <p className="font-semibold">Vận chuyển</p>
                    <p className="text-gray-600">
                      Giao hàng trong 1-3 ngày | Phí vần chuyển từ 10K
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="text-shopee-500 flex-shrink-0" size={20} />
                  <div className="text-sm">
                    <p className="font-semibold">Bảo vệ người mua</p>
                    <p className="text-gray-600">
                      Thanh toán an toàn, sản phẩm được bảo hành 100%
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="font-semibold mb-2">Số lượng</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border border-gray-300 rounded py-1"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-4">
                    {product.stock || 1000} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="px-6 py-3 border border-shopee-500 text-shopee-500 rounded font-bold hover:bg-shopee-50 transition flex items-center justify-center gap-2">
                  <Heart size={20} />
                  Yêu thích
                </button>
                <button className="px-6 py-3 bg-shopee-500 text-white rounded font-bold hover:bg-shopee-600 transition flex items-center justify-center gap-2">
                  Thêm vào giỏ
                </button>
              </div>
              <button className="w-full px-6 py-3 bg-white border border-shopee-500 text-shopee-500 rounded font-bold hover:bg-shopee-50 transition flex items-center justify-center gap-2">
                <Share2 size={20} />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded shadow-shopee overflow-hidden mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              <button className="px-6 py-4 font-bold border-b-2 border-shopee-500 text-shopee-500 whitespace-nowrap">
                Mô Tả Sản Phẩm
              </button>
              <button className="px-6 py-4 font-bold text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Đánh Giá ({product.reviews || 0})
              </button>
              <button className="px-6 py-4 font-bold text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Gửi Hỏi Đáp
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4">Chi tiết sản phẩm</h3>
            <div className="space-y-4 text-gray-700">
              <p>{product.description || "Không có mô tả"}</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="font-semibold text-gray-900">Thương hiệu</p>
                  <p className="text-gray-600">{product.brand || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Danh mục</p>
                  <p className="text-gray-600">{product.category || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Hạn sử dụng</p>
                  <p className="text-gray-600">{product.expiryDate || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Màu sắc</p>
                  <p className="text-gray-600">{product.color || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Đánh Giá Sản Phẩm</h2>

          {/* Success Message */}
          {reviewSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-3">
              <span className="text-lg">✓</span>
              <p>{reviewSuccess}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Review Form */}
            <div className="lg:col-span-1">
              {isAuthenticated ? (
                <ReviewForm
                  productId={id}
                  onSubmit={handleAddReview}
                  isLoading={submittingReview}
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Vui lòng đăng nhập để đánh giá sản phẩm
                  </p>
                  <a
                    href="/login"
                    className="inline-block bg-shopee-500 text-white py-2 px-4 rounded font-medium hover:bg-shopee-600 transition"
                  >
                    Đăng Nhập
                  </a>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {reviewsLoading ? (
                <div className="text-center py-8">Đang tải đánh giá...</div>
              ) : (
                <ReviewList
                  reviews={reviews}
                  onDelete={handleDeleteReview}
                  currentUserId={user?.id}
                />
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Sản Phẩm Liên Quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
