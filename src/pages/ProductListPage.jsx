import React, { useState, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import {
  productService,
  categoryService,
  reviewService,
} from "../services/api";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const selectedCategory = searchParams.get("category");
  const searchTerm = searchParams.get("searchTerm");
  const pageSize = 20;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, sortBy, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts(
        currentPage,
        pageSize,
        searchTerm,
      );
      let items = response.data.data.items || [];

      // Filter by category
      if (selectedCategory) {
        items = items.filter((p) => {
          // Check by categoryId first
          if (p.categoryId === selectedCategory) return true;

          // Check by categoryNames array (fallback for API response structure)
          if (p.categoryNames && Array.isArray(p.categoryNames)) {
            // Find category name from categories list using id
            const selectedCatName = categories.find(
              (c) => c.id === selectedCategory,
            )?.name;
            if (selectedCatName && p.categoryNames.includes(selectedCatName)) {
              return true;
            }
          }

          return false;
        });
      }

      // Sort
      if (sortBy === "price-asc") {
        items.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        items.sort((a, b) => b.price - a.price);
      }

      // Fetch overall stars and reviews count for each product
      const itemsWithStars = await Promise.all(
        items.map(async (product) => {
          let overallStars = 0;
          let reviewCount = 0;

          try {
            // Fetch overall stars
            const starsResponse =
              await reviewService.getOverallStarsByProductId(product.id);
            const starsValue =
              starsResponse.data?.data ?? starsResponse.data ?? 0;
            overallStars = typeof starsValue === "number" ? starsValue : 0;
          } catch (error) {
            console.error(
              `Error fetching stars for product ${product.id}:`,
              error.response?.status,
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

      setProducts(itemsWithStars);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories(1, 100);
      setCategories(response.data.data.items || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    if (categoryId === selectedCategory) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setCurrentPage(1);
    setSearchParams(searchParams);
  };

  const handleSort = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <span>Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-shopee-500">Sản phẩm</span>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Filters */}
          <div
            className={`${filterOpen ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0`}
          >
            <div className="bg-white rounded shadow-shopee p-4 mb-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter size={18} />
                Bộ lọc
              </h3>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold mb-3 text-sm">Danh Mục</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.id}
                        onChange={() => handleCategoryFilter(cat.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold mb-3 text-sm">Giá</h4>
                <div className="space-y-2">
                  {["Dưới 100K", "100K - 500K", "500K - 1M", "Trên 1M"].map(
                    (price) => (
                      <label
                        key={price}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{price}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-sm">Đánh giá</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2].map((stars) => (
                    <label
                      key={stars}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        {stars === 5 ? "5 sao" : `${stars}+ sao`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filter Button */}
            <button
              onClick={() => {
                searchParams.delete("category");
                searchParams.delete("q");
                setSearchParams(searchParams);
              }}
              className="w-full btn-shopee-outline"
            >
              Xoá bộ lọc
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-gray-600">
                <span className="text-shopee-500 font-bold">
                  {products.length}
                </span>{" "}
                sản phẩm tìm thấy
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="md:hidden btn-shopee-outline flex-1"
                >
                  <Filter size={16} className="inline mr-2" />
                  Bộ lọc
                </button>

                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="input-shopee appearance-none pr-8"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Phổ biến</option>
                    <option value="price-asc">Giá thấp tới cao</option>
                    <option value="price-desc">Giá cao tới thấp</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-2 top-3 pointer-events-none text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">Đang tải...</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Không tìm thấy sản phẩm nào</p>
                <p className="text-sm">Hãy thử thay đổi bộ lọc</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded ${
                      currentPage === i + 1
                        ? "bg-shopee-500 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductListPage;
