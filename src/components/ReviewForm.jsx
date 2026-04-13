import React, { useState } from "react";
import { AlertCircle, Loader } from "lucide-react";

const ReviewForm = ({ productId, onSubmit, isLoading = false }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (rating < 1 || rating > 5) {
      setError("Vui lòng chọn từ 1 đến 5 sao");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Bình luận phải có ít nhất 10 ký tự");
      return;
    }

    try {
      await onSubmit(productId, rating, comment);
      // Reset form
      setRating(5);
      setComment("");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chia sẻ đánh giá của bạn
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle
            size={20}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá (*) - {hoveredRating || rating} sao
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="text-4xl transition transform hover:scale-110"
              >
                <span
                  className={
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Bấm vào để chọn số sao</p>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bình luận (*){" "}
            <span className="text-gray-500">tối thiểu 10 ký tự</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shopee-500 focus:border-transparent resize-none"
            rows="4"
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 ký tự
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-shopee-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-shopee-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader size={18} className="animate-spin" />}
          {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
