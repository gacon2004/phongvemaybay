import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/payments/payment.css";

const money = (n) =>
  (Number(n || 0)).toLocaleString("vi-VN", { maximumFractionDigits: 0 }).replaceAll(",", ".") + " đ";

export default function Payment() {
  const { state } = useLocation();
  const nav = useNavigate();
  const order = state;

  if (!order) {
    return (
      <div className="payment-wrap container">
        <div className="payment-card">
          Không có dữ liệu đơn hàng. <button onClick={() => nav("/")}>Về trang chủ</button>
        </div>
      </div>
    );
  }

  const { flight, passengers, phone, totals, priceBreakdown } = order;

  return (
    <div className="payment-wrap container">
      <div className="pay-grid">
        <div className="pay-left">
          <div className="box">
            <div className="box-header">Thông tin đơn hàng</div>
            <div className="row">
              <strong>Chiều đi:</strong>&nbsp;{flight.from_label} → {flight.to_label}
            </div>
            <div className="row">
              <strong>Thời gian:</strong>&nbsp;{flight.depTime} → {flight.arrTime}
            </div>
            <div className="row"><strong>Hành khách</strong></div>
            <ul className="pax-list">
              {passengers.map((p, i) => (
                <li key={i}>{p.title} {p.fullName} — Ngày sinh: {p.day}/{p.month}/{p.year}</li>
              ))}
            </ul>
            <div className="row"><strong>Số điện thoại liên hệ:</strong>&nbsp;{phone}</div>

            <div className="divider" />
            <div className="row"><strong>GIÁ VÉ ĐÃ BAO GỒM THUẾ PHÍ</strong></div>
            <ul className="bullet">
              <li>Không phát sinh chi phí nào khác</li>
              <li>Ưu tiên chọn chỗ tốt</li>
              <li>Hành lý theo chính sách hãng</li>
            </ul>
          </div>
        </div>

        <aside className="pay-right">
          <div className="box">
            <div className="box-header">Thông tin Thanh toán</div>
            {priceBreakdown.adult.qty  > 0 && <div className="row"><span>Người lớn</span><strong>{money(priceBreakdown.adult.qty  * priceBreakdown.adult.unit)}</strong></div>}
            {priceBreakdown.child.qty  > 0 && <div className="row"><span>Trẻ em</span><strong>{money(priceBreakdown.child.qty  * priceBreakdown.child.unit)}</strong></div>}
            {priceBreakdown.infant.qty > 0 && <div className="row"><span>Em bé</span><strong>{money(priceBreakdown.infant.qty * priceBreakdown.infant.unit)}</strong></div>}

            {totals.discount > 0 && <div className="row discount"><span>Voucher -20%</span><strong>-{money(totals.discount)}</strong></div>}

            <div className="total">
              <div>TỔNG CỘNG</div>
              <div className="total-number">{money(totals.grandTotal)}</div>
            </div>

            {/* QR fake (ảnh minh họa) */}
            <div className="qr-box">
              <img src="https://i.imgur.com/7yVDmQJ.png" alt="VietQR" />
            </div>

            <button className="btn primary" onClick={() => alert("Đã thanh toán (demo)")}>Đã Thanh toán</button>
            <button className="btn ghost" onClick={() => nav("/")}>Quay về trang chủ</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
