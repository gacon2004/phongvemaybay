import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/payments/payment.css";

const money = (n) =>
  (Number(n || 0))
    .toLocaleString("vi-VN", { maximumFractionDigits: 0 })
    .replaceAll(",", ".") + " đ";

export default function Payment() {
  const { state } = useLocation();
  const nav = useNavigate();
  const order = state; // { flight, passengers, phone, grandTotal, ... }

  if (!order) {
    return (
      <div className="payment-page-container">
        <div className="payment-card no-data">
          <p>Không có dữ liệu đơn hàng.</p>
          <button onClick={() => nav("/")} className="btn btn-primary">
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const { flight, passengers, phone, grandTotal } = order;
  const mainPassenger = passengers?.[0] || {};

  // ====== ĐIỀU HƯỚNG SAU KHI XÁC NHẬN THANH TOÁN ======
  const handleConfirm = () => {
    // (tuỳ chọn) lưu tạm vào localStorage để trang thông báo dùng lại
    try {
      localStorage.setItem(
        "lastPaidOrder",
        JSON.stringify({
          when: Date.now(),
          amount: grandTotal,
          phone,
          pax: passengers?.length || 1,
          route: `${flight?.from_label} → ${flight?.to_label}`,
        })
      );
    } catch {}

    // Điều hướng sang trang thông báo (Notice)
    nav("/contact-page?paid=true", {
      replace: true,
      state: { order }, // nếu muốn mang cả dữ liệu sang trang /contact-page
    });
  };

  return (
    <div className="payment-page-container">
      <div className="payment-grid">
        {/* === CỘT TRÁI === */}
        <div className="order-details-card">
          <h2 className="card-header-red">Thông tin đơn hàng</h2>

          <div className="info-section flight-info">
            <div className="info-row">
              <span>Chiều đi:</span>
              <strong>{flight.from_label} – {flight.to_label}</strong>
            </div>
            <div className="info-row">
              <span>Thời gian:</span>
              {/* nếu bạn có ngày thật thì thay luôn nhé */}
              <strong>{flight.depTime} - {flight.arrTime} | Ngày: 4/9/2025</strong>
            </div>
          </div>

          <div className="info-section passenger-info">
            <h3 className="section-title">Hành khách</h3>
            <div className="passenger-block">
              <span>{mainPassenger.title} {mainPassenger.fullName}</span>
              <span>
                Ngày sinh: {mainPassenger.day}/{mainPassenger.month}/{mainPassenger.year}
              </span>
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

        {/* === CỘT PHẢI === */}
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
                <span className="value">TPBANK - Ngân Hàng Tiên Phong</span>
              </div>
              <div className="bank-info-row">
                <span className="label">Chủ tài khoản:</span>
                <span className="value">DO DAT GIA PHAT</span>
              </div>
              <div className="bank-info-row">
                <span className="label">Số tài khoản:</span>
                <span className="value">9989 8386 888</span>
              </div>
              <div className="bank-info-row">
                <span className="label">Nội dung:</span>
                <span className="value">VEMAYBAY247</span>
              </div>
            </div>

            <div className="qr-code-container">
              <img src="https://i.ibb.co/Y7JY2Wtv/image.png" alt="VietQR" />
            </div>

            <div className="action-buttons">
              <button className="btn btn-confirm-payment" onClick={handleConfirm}>
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
