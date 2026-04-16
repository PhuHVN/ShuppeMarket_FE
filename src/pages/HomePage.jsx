import React, { useState, useEffect } from "react";
import { Zap, Truck, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import { productService, cartService, reviewService } from "../services/api";

const HomePage = () => {
  const navigate = useNavigate();
  const { categories, isAuthenticated } = useAuth();
  const { incrementCartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [cartSuccess, setCartSuccess] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts(1, 12);
      const productsData = response.data.data.items || [];
      console.log("Products fetched:", productsData);

      // Fetch overall stars and reviews count for each product
      const productsWithStars = await Promise.all(
        productsData.map(async (product) => {
          let overallStars = 0;
          let reviewCount = 0;

          try {
            // Fetch overall stars
            const starsResponse =
              await reviewService.getOverallStarsByProductId(product.id);
            const starsValue =
              starsResponse.data?.data ?? starsResponse.data ?? 0;
            overallStars = typeof starsValue === "number" ? starsValue : 0;
            console.log(`Stars for product ${product.id}:`, overallStars);
          } catch (error) {
            console.error(
              `Error fetching stars for product ${product.id}:`,
              error.response?.status,
              error.response?.data,
            );
          }

          try {
            // Fetch reviews count
            const reviewsResponse = await reviewService.getReviewsByProductId(
              product.id,
              1,
              100,
            );
            reviewCount =
              reviewsResponse.data?.data?.totalCount ||
              reviewsResponse.data?.data?.items?.length ||
              0;
            console.log(
              `Reviews count for product ${product.id}:`,
              reviewCount,
            );
          } catch (error) {
            console.error(
              `Error fetching reviews for product ${product.id}:`,
              error.response?.status,
            );
          }

          return {
            ...product,
            overallStars: overallStars,
            reviews: reviewCount,
          };
        }),
      );

      console.log("Products with stars and reviews:", productsWithStars);
      setProducts(productsWithStars);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(product.id);
      setCartSuccess("");

      await cartService.addToCart([
        {
          productId: product.id,
          quantity: 1,
        },
      ]);

      setCartSuccess(`"${product.name}" đã được thêm vào giỏ hàng!`);
      incrementCartCount();
      setTimeout(() => setCartSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
      );
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <MainLayout>
      {/* Success Message */}
      {cartSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-4 rounded-b m-4 flex items-center gap-3 fixed top-14 left-4 right-4 z-50 shadow-lg">
          <span className="text-2xl">✓</span>
          <span className="font-medium">{cartSuccess}</span>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-shopee-500 via-shopee-600 to-shopee-700 text-white py-16 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full"></div>
        <div className="absolute left-1/4 -bottom-20 w-60 h-60 bg-white/5 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              Chào mừng bạn 👋
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Khám phá triệu sản phẩm
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Mua sắm dễ dàng với giá tốt nhất và chất lượng đảm bảo
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-shopee-500 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              Bắt đầu mua sắm
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Giao Hàng Đ. Tín",
                desc: "Chỉ 24-48h giao tận tay",
                color: "text-yellow-500",
              },
              {
                icon: ShieldCheck,
                title: "Hàng Chính Hãng",
                desc: "100% sản phẩm thật",
                color: "text-blue-500",
              },
              {
                icon: Truck,
                title: "Hoàn Tiền Dễ",
                desc: "30 ngày hoàn tiền nếu không hài lòng",
                color: "text-green-500",
              },
              {
                icon: Headphones,
                title: "Hỗ Trợ 24/7",
                desc: "Luôn sẵn sàng giúp bạn",
                color: "text-purple-500",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-6 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className={`${item.color} p-3 bg-gray-50 rounded-lg`}>
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          Danh Mục Nổi Bật
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {categories && categories.length > 0 ? (
            categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center hover:shadow-md transition hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">📦</div>
                <p className="font-semibold text-gray-900 text-sm">
                  {cat.name || cat.categoryName}
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>Không có danh mục nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Flash Sale Section */}
      <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-t border-b border-gray-200 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-500 text-white p-3 rounded-lg">
              <Zap size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Flash Sale 🔥</h2>
            <div className="ml-auto">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold animate-pulse">
                Ưu đãi hạn chế!
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin mb-3">⚙️</div>
                  <p className="text-gray-500 font-medium">
                    Đang tải sản phẩm...
                  </p>
                </div>
              </div>
            ) : products.length > 0 ? (
              products
                .slice(0, 4)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAdding={addingToCart === product.id}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p className="text-lg">📭 Không có sản phẩm nào để hiển thị</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Sản Phẩm Được Yêu Thích
            </h2>
            <p className="text-gray-600 mt-1">
              Những sản phẩm bán chạy nhất tháng này
            </p>
          </div>
          <Link
            to="/products"
            className="text-shopee-500 font-semibold hover:text-shopee-600 flex items-center gap-1 transition"
          >
            Xem tất cả
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin mb-3">⚙️</div>
                <p className="text-gray-500 font-medium">
                  Đang tải sản phẩm...
                </p>
              </div>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingToCart === product.id}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg">📭 Không có sản phẩm nào để hiển thị</p>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-shopee-500 to-shopee-600 text-white py-12 rounded-lg mb-8 mx-4 md:mx-0">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Nhận thông báo khuyến mãi</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Đăng ký email để nhận thông tin về sản phẩm mới, khuyến mãi độc
            quyền và ưu đãi đặc biệt
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
              required
            />
            <button
              type="submit"
              className="btn-shopee bg-white text-shopee-500 hover:bg-gray-100 whitespace-nowrap"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
