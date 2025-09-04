import React from "react";
import "../styles/layout/footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        {/* khối footer thu đúng theo container */}
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <h4>Bạn còn thắc mắc</h4>
              <ul className="foot-links">
                <li><a href="/">Liên hệ</a></li>
                <li><a href="/">Hướng dẫn thanh toán</a></li>
                <li><a href="/">Thông tin chuyển khoản</a></li>
                <li><a href="/">Hướng dẫn đặt vé</a></li>
                <li><a href="/">Câu hỏi thường gặp</a></li>
              </ul>
            </div>
            <div>
              <h4>Về chúng tôi</h4>
              <ul className="foot-links">
                <li><a href="/">Giới thiệu</a></li>
                <li><a href="/">Điều khoản sử dụng</a></li>
                <li><a href="/">Chính sách bảo mật</a></li>
                <li><a href="/">Tin tức</a></li>
              </ul>
            </div>
            <div>
              <h4>Quản lý đặt đặt</h4>
              <ul className="foot-links">
                <li><a href="/">Xem đơn hàng</a></li>
                <li><a href="/">Thanh toán trực tuyến</a></li>
              </ul>
            </div>
            <div>
                <img src="https://www.abay.vn/_Web/_File/Images/Icons/BoCongThuong.png" alt="Bộ Công Thương" />
            </div>
          </div>

          <div className="copyright">
            © 2025 VEMAYBAY247 — Đã thông báo Bộ Công Thương
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
