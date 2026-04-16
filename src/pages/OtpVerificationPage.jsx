import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { authService } from "../services/api";

const OtpVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    otp: ["", "", "", "", "", ""],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpInputs = useRef([]);

  useEffect(() => {
    // Get email from registration redirect
    const state = location.state;
    if (state?.email) {
      setEmail(state.email);
    } else {
      // If no email in state, redirect back to register
      navigate("/register");
    }
  }, [location, navigate]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOtpChange = (value, index) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    // Auto move to next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = formData.otp.join("");

    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await authService.verifyOtp(email, otpCode);
      setSuccess("Xác nhận OTP thành công! Đang chuyển hướng...");
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Đăng ký thành công! Vui lòng đăng nhập." },
        });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      // Note: The backend should handle resending OTP
      // For now, we'll show a message to contact support
      setSuccess("Vui lòng kiểm tra email của bạn hoặc liên hệ hỗ trợ");
      setResendCountdown(60);
    } catch (err) {
      setError("Không thể gửi lại OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center py-12 text-gray-500">
            Đang tải thông tin...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-shopee p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Xác Nhận OTP</h1>
            <p className="text-gray-600 text-sm">
              Nhập mã OTP 6 chữ số được gửi tới <br />
              <span className="font-semibold text-gray-800">{email}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start gap-3 rounded-r">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm flex items-start gap-3 rounded-r">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>{success}</div>
            </div>
          )}

          {/* OTP Input Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* OTP Inputs */}
            <div className="flex gap-2 justify-center">
              {formData.otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-shopee-500 focus:outline-none transition"
                  placeholder="0"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || formData.otp.join("").length !== 6}
              className="w-full bg-shopee-500 text-white py-3 rounded-lg font-semibold hover:bg-shopee-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Đang xác nhận..." : "Xác Nhận OTP"}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            {resendCountdown > 0 ? (
              <p className="text-sm text-gray-600">
                Gửi lại OTP trong{" "}
                <span className="font-semibold text-shopee-500">
                  {resendCountdown}
                </span>{" "}
                giây
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-shopee-500 hover:text-shopee-600 font-semibold transition disabled:text-gray-400"
              >
                Gửi lại OTP
              </button>
            )}
          </div>

          {/* Back to Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Không nhận được mã OTP?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-shopee-500 hover:text-shopee-600 font-semibold transition"
              >
                Quay lại
              </button>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OtpVerificationPage;
