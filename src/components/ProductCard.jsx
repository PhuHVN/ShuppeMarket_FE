import React, { useState } from "react";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart = () => {} }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!product.originalPrice || !product.price) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
  };

  return (
    <div className="card-shopee overflow-hidden flex flex-col h-full hover:shadow-shopee-lg transition">
      {/* Product Image Container */}
      <Link
        to={`/products/${product.id}`}
        className="relative overflow-hidden bg-gray-100 h-48 group block"
      >
        <img
          src={
            product.imageUrl ||
            "https://via.placeholder.com/240x240?text=Product"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <span className="badge-new">🆕 MỚI</span>}
          {calculateDiscount() > 0 && (
            <span className="badge-hot">-{calculateDiscount()}%</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:shadow-md transition transform hover:scale-110"
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }
          />
        </button>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 text-gray-800 hover:text-shopee-500 transition mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.floor(product.rating || 4)
                    ? "fill-current"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-shopee-500">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Seller & Location */}
        <div className="text-xs text-gray-500 mb-3 border-t border-gray-100 pt-2">
          <p className="mb-1">
            Bán bởi:{" "}
            <span className="text-shopee-500 font-medium">
              {product.seller || "ShuppeMarket"}
            </span>
          </p>
          <p>📍 {product.location || "TP. Hồ Chí Minh"}</p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="mt-auto w-full bg-shopee-500 text-white py-2 rounded font-medium text-sm hover:bg-shopee-600 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <ShoppingCart size={16} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
