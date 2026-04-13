import React from "react";
import { Trash2 } from "lucide-react";

const ReviewList = ({ reviews = [], onDelete, currentUserId }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Vừa xong";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} tuần trước`;
    return `${Math.floor(seconds / 2592000)} tháng trước`;
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition"
        >
          {/* Header - Rating + User + Date */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-600">
                  {review.rating} sao
                </span>
              </div>
              <p className="font-medium text-gray-900">
                {review.fullName || "Người dùng ẩn danh"}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(review.createAt)}
              </p>
            </div>

            {/* Delete Button */}
            {currentUserId === review.accountId && onDelete && (
              <button
                onClick={() => onDelete(review.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                title="Xóa đánh giá"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {/* Comment */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {review.comment || "Không có bình luận"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
