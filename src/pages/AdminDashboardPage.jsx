import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, Search, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { sellerService } from "../services/api";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, active, inactive
  const [approving, setApproving] = useState({});

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      return;
    }

    fetchSellers();
  }, [isAdmin]);

  useEffect(() => {
    filterSellers();
  }, [sellers, searchQuery, filterStatus]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await sellerService.getAllSellers(1, 100);
      setSellers(response.data.data.items || []);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSellers = () => {
    let filtered = sellers;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (seller) =>
          seller.shopName?.toLowerCase().includes(query) ||
          seller.account?.email?.toLowerCase().includes(query) ||
          seller.account?.fullName?.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (seller) => seller.account?.status?.toLowerCase() === filterStatus,
      );
    }

    setFilteredSellers(filtered);
  };

  const handleApproveSeller = async (sellerId) => {
    if (!window.confirm("Bạn chắc chắn muốn duyệt seller này?")) {
      return;
    }

    try {
      setApproving((prev) => ({ ...prev, [sellerId]: true }));

      const response = await sellerService.approveSeller(sellerId);

      // Update local state
      setSellers((prev) =>
        prev.map((seller) =>
          seller.id === sellerId
            ? {
                ...seller,
                account: { ...seller.account, status: "Active" },
              }
            : seller,
        ),
      );

      alert("Duyệt seller thành công!");
    } catch (error) {
      console.error("Error approving seller:", error);
      alert(
        "Lỗi: " + (error.response?.data?.message || "Không thể duyệt seller"),
      );
    } finally {
      setApproving((prev) => ({ ...prev, [sellerId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    status = status?.toLowerCase();
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          <Clock size={14} />
          Chờ duyệt
        </span>
      );
    }
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle size={14} />
          Đã duyệt
        </span>
      );
    }
    if (status === "inactive") {
      return (
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          <XCircle size={14} />
          Vô hiệu
        </span>
      );
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <Loader
              size={48}
              className="mx-auto text-shopee-500 mb-4 animate-spin"
            />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin()) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-gray-600">
              Bạn không có quyền truy cập trang này
            </p>
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
            Quản lý Seller
          </h1>
          <p className="text-gray-600">
            Duyệt ứng dụng seller và quản lý các cửa hàng
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Tổng Seller",
              value: sellers.length,
              color: "blue",
              icon: "👥",
            },
            {
              label: "Chờ duyệt",
              value: sellers.filter(
                (s) => s.account?.status?.toLowerCase() === "pending",
              ).length,
              color: "yellow",
              icon: "⏳",
            },
            {
              label: "Đã duyệt",
              value: sellers.filter(
                (s) => s.account?.status?.toLowerCase() === "active",
              ).length,
              color: "green",
              icon: "✅",
            },
            {
              label: "Vô hiệu",
              value: sellers.filter(
                (s) => s.account?.status?.toLowerCase() === "inactive",
              ).length,
              color: "red",
              icon: "❌",
            },
          ].map((stat, idx) => (
            <div key={idx} className="card-shopee p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card-shopee p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm theo tên cửa hàng, email, tên người bán..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-shopee pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-shopee"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="active">Đã duyệt</option>
              <option value="inactive">Vô hiệu</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card-shopee overflow-hidden">
          {filteredSellers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Không tìm thấy seller nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Cửa hàng
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Người bán
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((seller) => (
                    <tr
                      key={seller.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {seller.logoUrl ? (
                            <img
                              src={seller.logoUrl}
                              alt={seller.shopName}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              🏪
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {seller.shopName}
                            </p>
                            {seller.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {seller.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {seller.account?.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {seller.account?.fullName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(seller.account?.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {seller.account?.status?.toLowerCase() ===
                          "pending" && (
                          <button
                            onClick={() => handleApproveSeller(seller.id)}
                            disabled={approving[seller.id]}
                            className="btn-shopee text-sm py-1.5 px-3 disabled:opacity-70 flex items-center gap-1 justify-center"
                          >
                            {approving[seller.id] ? (
                              <>
                                <Loader size={14} className="animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={14} />
                                Duyệt
                              </>
                            )}
                          </button>
                        )}
                        {seller.account?.status?.toLowerCase() !==
                          "pending" && (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 card-shopee p-6 bg-blue-50 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">ℹ️ Hướng dẫn</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✅ Duyệt seller để họ có thể tạo sản phẩm</li>
            <li>⏳ Seller được register sẽ có trạng thái "Chờ duyệt"</li>
            <li>✅ Khi duyệt, Account.Status sẽ chuyển thành "Active"</li>
            <li>📦 Seller chỉ tạo được product khi status = Active</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
