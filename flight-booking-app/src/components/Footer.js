import React from "react";
import "../styles/layout/footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-grid">
            
            {/* === KHỐI CÁC LIÊN KẾT === */}
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
              <h4>Quản lý đặt chỗ</h4>
              <ul className="foot-links">
                <li><a href="/">Xem đơn hàng</a></li>
                <li><a href="/">Thanh toán trực tuyến</a></li>
              </ul>
            </div>
            
            {/* === KHỐI ĐỐI TÁC & CHỨNG NHẬN === */}
            <div className="partners-section"> {/* Thêm className cho khối này */}
              <h4>Đối tác & Chứng nhận</h4>
              
              {/* Đối tác thanh toán */}
              <p>Đối tác thanh toán:</p>
              <div className="payment-partner-logo"> {/* Thêm className cho div chứa logo đối tác */}
                <img src="https://i.ibb.co/8qgvWP0/image.png" alt="Đối tác thanh toán" />
              </div>

              {/* Các logo chứng nhận và hãng */}
              <div className="certification-logos"> {/* Thêm className cho div chứa các logo nhỏ */}
                <img src="https://www.abay.vn/_Web/_File/Images/Icons/BoCongThuong.png" alt="Bộ Công Thương" />
                <img src="https://i.ibb.co/KcfnXPwr/image.png" alt="Bộ Công an" />
                <img src="https://i.ibb.co/Lh2cF2gq/image.png" alt="Vietnam Airlines" />
                <img src="https://i.ibb.co/fdC642JN/image.png" alt="Vietjet Air" />
                <img src="https://i.ibb.co/9Hr7WKcK/image.png" alt="Bamboo Airways" />
                <img src="https://i.ibb.co/m51rMJVZ/image.png" alt="Vietravel Airlines" />
              </div>
            </div>

          </div>

          <div className="copyright">
            © 2025 VEMAYBAY247 — Đã thông báo Bộ Công Thương - Bộ Công An
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;