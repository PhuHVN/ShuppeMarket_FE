import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <div className="bg-shopee-500 text-white w-8 h-8 rounded flex items-center justify-center text-sm font-bold">
                S
              </div>
              ShuppeMarket
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nền tảng thương mại điện tử hàng đầu Việt Nam. Cung cấp triệu sản
              phẩm đa dạng với giá cạnh tranh và dịch vụ chất lượng.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400 hover:text-shopee-500 transition cursor-pointer">
                <Phone size={16} className="flex-shrink-0" />
                <span>1900-6035</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-shopee-500 transition cursor-pointer">
                <Mail size={16} className="flex-shrink-0" />
                <span>support@shoppemarket.vn</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-shopee-500 transition cursor-pointer">
                <MapPin size={16} className="flex-shrink-0" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Thực Phẩm",
                "Điện Tử",
                "Thời Trang",
                "Sách & Học Tập",
                "Phụ Kiện",
              ].map((cat) => (
                <li key={cat}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-shopee-500 transition flex items-center gap-1 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition"
                    />
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Trung Tâm Trợ Giúp",
                "Chính Sách Bảo Mật",
                "Điều Khoản Sử Dụng",
                "Liên Hệ Chúng Tôi",
                "Trở Thành Người Bán",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-shopee-500 transition flex items-center gap-1 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition"
                    />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & App */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">
                Kết Nối Với Chúng Tôi
              </h4>
              <div className="flex gap-3 mb-6">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Twitter, label: "Twitter" },
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href="#"
                      className="bg-gray-800 p-2.5 rounded-lg hover:bg-shopee-500 transition transform hover:scale-110"
                      title={social.label}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h5 className="text-white font-semibold text-sm mb-2">
                📱 Ứng dụng ShuppeMarket
              </h5>
              <p className="text-xs text-gray-400 mb-3">
                Tải ứng dụng để nhận voucher độc quyền
              </p>
              <button className="bg-shopee-500 text-white px-4 py-2 rounded-lg font-medium w-full hover:bg-shopee-600 transition text-sm">
                Tải Ứng Dụng
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p className="order-2 md:order-1 mt-4 md:mt-0">
            &copy; 2024 ShuppeMarket. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 order-1 md:order-2 justify-center md:justify-end">
            {["Bản Quyền", "Liên Hệ", "Về Chúng Tôi", "Sitemap"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-shopee-500 transition"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
