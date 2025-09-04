import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/payments/payment.css"; // Đảm bảo bạn đã import file CSS này

const money = (n) =>
  (Number(n || 0)).toLocaleString("vi-VN", { maximumFractionDigits: 0 }).replaceAll(",", ".") + " đ";

export default function Payment() {
  const { state } = useLocation();
  const nav = useNavigate();
  const order = state; 

  if (!order) {
    return (
      <div className="payment-page-container">
        <div className="payment-card no-data">
          <p>Không có dữ liệu đơn hàng.</p>
          <button onClick={() => nav("/")} className="btn btn-primary">Về trang chủ</button>
        </div>
      </div>
    );
  }

  const { flight, passengers, phone, grandTotal } = order;
  const mainPassenger = passengers[0] || {}; // Lấy hành khách đầu tiên làm ví dụ

  return (
    <div className="payment-page-container">
      <div className="payment-grid">
        {/* === CỘT TRÁI: THÔNG TIN ĐƠN HÀNG === */}
        <div className="order-details-card">
          <h2 className="card-header-red">Thông tin đơn hàng</h2>
          
          <div className="info-section flight-info">
            <div className="info-row">
                <span>Chiều đi:</span>
                <strong>{flight.from_label} – {flight.to_label}</strong>
            </div>
            <div className="info-row">
                <span>Thời gian:</span>
                <strong>{flight.depTime} - {flight.arrTime} | Ngày: 4/9/2025</strong> {/* Giả định ngày */}
            </div>
          </div>

          <div className="info-section passenger-info">
            <h3 className="section-title">Hành khách</h3>
            <div className="passenger-block">
                <span>{mainPassenger.title} {mainPassenger.fullName}</span>
                <span>Ngày sinh: {mainPassenger.day}/{mainPassenger.month}/{mainPassenger.year}</span>
            </div>
            <div className="info-row contact-info">
                <span>Số điện thoại liên hệ:</span>
                <strong>{phone}</strong>
            </div>
          </div>

          <div className="info-section included-info">
            <h3 className="section-title green">GIÁ VÉ ĐÃ BAO GỒM THUẾ PHÍ</h3>
            <ul className="included-list">
              <li>Không phát sinh thêm bất cứ chi phí nào khác</li>
              <li>Ưu tiên chọn chỗ cho Anh/Chị chỗ ngồi tốt nhất</li>
              <li>Hành lý được mang 7kg xách tay và 20kg ký gửi (Vé Trong Nước)</li>
              <li>Hành lý được mang 7kg xách tay và 40kg ký gửi (Vé Quốc Tế)</li>
            </ul>
          </div>
        </div>

        {/* === CỘT PHẢI: THÔNG TIN THANH TOÁN === */}
        <div className="payment-actions-column">
            <div className="alert-box">
                <strong>Anh chị vui lòng kiểm tra lại thông tin và thanh toán theo hóa đơn</strong>
            </div>

            <div className="payment-details-card">
                <h2 className="card-header-blue">Thông tin Thanh toán</h2>
                
                <div className="bank-info-section">
                    <div className="bank-info-row">
                        <span className="label">Số tiền:</span>
                        <span className="value amount-highlight">{money(grandTotal)}</span>
                    </div>
                    <div className="bank-info-row">
                        <span className="label">Ngân hàng:</span>
                        <span className="value">VIB - Ngân Hàng Quốc Tế</span>
                    </div>
                    <div className="bank-info-row">
                        <span className="label">Chủ tài khoản:</span>
                        <span className="value">HOANG THI SAM</span>
                    </div>
                    <div className="bank-info-row">
                        <span className="label">Số tài khoản:</span>
                        <span className="value">081459765</span>
                    </div>
                    <div className="bank-info-row">
                        <span className="label">Nội dung:</span>
                        <span className="value">TEN VJCB NHTO MUA VE MAY BAY</span>
                    </div>
                </div>

                <div className="qr-code-container">
                    <img src="https://i.ibb.co/Y7JY2Wtv/image.png" alt="VietQR" />
                </div>
                
                <div className="action-buttons">
                    <button className="btn btn-confirm-payment" onClick={() => alert("Đã thanh toán (demo)")}>
                        Đã Thanh toán
                    </button>
                    <button className="btn btn-back-home" onClick={() => nav("/")}>
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}