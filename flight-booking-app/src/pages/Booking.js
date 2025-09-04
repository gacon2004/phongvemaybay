// src/pages/Booking.js
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/bookings/booking.css";

/* ===== Helpers, constants (PHẢI có để tránh no-undef) ===== */
const money = (n) =>
  (Number(n || 0))
    .toLocaleString("vi-VN", { maximumFractionDigits: 0 })
    .replaceAll(",", ".") + " đ";

const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const ADULT_TITLES = ["Ông", "Bà", "Anh", "Chị"];
const CHILD_TITLE = "Bé";

const makePassenger = (type, idx) => ({
  id: `${type}-${idx}`,
  type, // "adult" | "child" | "infant"
  title: type === "adult" ? "Ông" : "Bé",
  fullName: "",
  day: 1,
  month: 1,
  year: type === "adult" ? 1990 : type === "child" ? 2015 : 2023,
});

export default function Booking() {
  const nav = useNavigate();
  const { state } = useLocation();

  // Nhận form + flight từ Results (hoặc fallback demo)
  const form = state?.form || {
    adults: 1,
    children: 0,
    infants: 0,
    from_label: "Hà Nội (HAN)",
    to_label: "Tp Hồ Chí Minh (SGN)",
  };

  const flight = state?.flight || {
    airlineName: "Vietravel Airlines",
    airlineLogo: "",
    aircraft: "Airbus A321",
    from_label: form.from_label,
    to_label: form.to_label,
    depTime: "22:50",
    arrTime: "01:00",
    segmentText: `Chặng 1: ${form.from_label} (${form?.depTime || "22:50"}) — ${form.to_label} (${form?.arrTime || "01:00"}) | Hãng: Vietravel Airlines | Máy bay: Airbus A321`,
  };

  // Giá đơn vị (nếu Results truyền priceDetails thì dùng, không thì dùng ví dụ)
  const priceDetails = state?.priceDetails || {
    base: 2119000, // ví dụ
    taxes: 0,
    total: 2119000,
  };
  const perBase = priceDetails.base ?? Math.max((priceDetails.total || 0) - (priceDetails.taxes || 0), 0);
  const perTax = priceDetails.taxes ?? Math.max((priceDetails.total || 0) - perBase, 0);

  const paxAdults = Number(form.adults || 0);
  const paxChildren = Number(form.children || 0);
  const paxInfants = Number(form.infants || 0);

  // Tính tổng theo số khách
  const pricePerAdult = perBase + perTax;
  const pricePerChild = perBase + perTax; // có thể khác nếu cần
  const pricePerInfant = 0;                // ví dụ: em bé 0đ

  const subAdults = paxAdults * pricePerAdult;
  const subChildren = paxChildren * pricePerChild;
  const subInfants = paxInfants * pricePerInfant;
  const subTotal = subAdults + subChildren + subInfants;

  // Voucher 20% (áp 1 lần)
  const [voucherApplied, setVoucherApplied] = useState(false);
  const discount = useMemo(() => (voucherApplied ? Math.round(subTotal * 0.2) : 0), [voucherApplied, subTotal]);
  const grandTotal = useMemo(() => subTotal - discount, [subTotal, discount]);

  /* Tạo form hành khách theo số lượng */
  const [adults, setAdults] = useState([]);
  const [children, setChildren] = useState([]);
  const [infants, setInfants] = useState([]);

  useEffect(() => {
    setAdults(Array.from({ length: paxAdults }, (_, i) => makePassenger("adult", i)));
  }, [paxAdults]);

  useEffect(() => {
    setChildren(Array.from({ length: paxChildren }, (_, i) => makePassenger("child", i)));
  }, [paxChildren]);

  useEffect(() => {
    setInfants(Array.from({ length: paxInfants }, (_, i) => makePassenger("infant", i)));
  }, [paxInfants]);

  /* Liên hệ */
  const [phone, setPhone] = useState("");
  const onPhoneChange = (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));

  // cập nhật từng hành khách
  const updatePax = (setter) => (idx, key, val) =>
    setter((list) => list.map((p, i) => (i === idx ? { ...p, [key]: val } : p)));

  const upAdult = updatePax(setAdults);
  const upChild = updatePax(setChildren);
  const upInfant = updatePax(setInfants);

  // validate: tên + ngày sinh + sđt
  const isPaxValid = (p) => !!p.fullName.trim() && p.day && p.month && p.year;
  const allValid =
    adults.every(isPaxValid) &&
    children.every(isPaxValid) &&
    infants.every(isPaxValid) &&
    /^\d{10}$/.test(phone);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!allValid) {
      if (!/^\d{10}$/.test(phone)) return setErr("Số điện thoại phải đủ 10 số.");
      return setErr("Vui lòng điền đầy đủ thông tin tất cả hành khách.");
    }

    // Khi hợp lệ: điều hướng sang trang Payment kèm dữ liệu order
    const orderData = {
      flight,
      passengers: [...adults, ...children, ...infants],
      phone,
      subTotal,
      discount,
      grandTotal,
    };
    nav("/payment", { state: orderData });
  };

  const TitleSelect = ({ value, onChange, type }) => {
    if (type === "adult") {
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {ADULT_TITLES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      );
    }
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value={CHILD_TITLE}>Bé</option>
      </select>
    );
  };

  const PaxRow = ({ label, list, onChange, type }) => (
    <>
      {list.map((p, idx) => (
        <div className="pax-block" key={p.id}>
          <div className="pax-title">{label} {idx + 1}</div>

          <div className="row-2">
            <TitleSelect value={p.title} type={type} onChange={(v) => onChange(idx, "title", v)} />
            <input
              placeholder="Họ và tên người bay... (vd: NGUYEN VAN A)"
              value={p.fullName}
              onBlur={(e) => onChange(idx, "fullName", e.target.value.toUpperCase())}
            />
          </div>

          <div className="row-3">
            <select value={p.day} onChange={(e) => onChange(idx, "day", Number(e.target.value))}>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={p.month} onChange={(e) => onChange(idx, "month", Number(e.target.value))}>
              {MONTHS.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
            </select>
            <select value={p.year} onChange={(e) => onChange(idx, "year", Number(e.target.value))}>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="booking-wrap container">
      <div className="booking-grid">
        {/* LEFT */}
        <div className="booking-left">
          <div className="box flight-box">
            <div className="box-header blue">
              Chiều đi: {flight.from_label} → {flight.to_label}
            </div>
            <div className="flyline">
              <div className="time">
                <strong>{flight.depTime}</strong> → <strong>{flight.arrTime}</strong>
              </div>
              <div className="meta">{flight.segmentText}</div>
            </div>
          </div>

          <form className="box" onSubmit={submit}>
            <div className="box-header">Thông tin hành khách và liên hệ</div>

            <PaxRow label="Người lớn" list={adults} onChange={upAdult} type="adult" />
            <PaxRow label="Trẻ em" list={children} onChange={upChild} type="child" />
            <PaxRow label="Em bé" list={infants} onChange={upInfant} type="infant" />

            <div className="contact-row">
              <label>Số điện thoại <span className="req">*</span></label>
              <input
                inputMode="numeric"
                pattern="\d*"
                placeholder="Nhập 10 số"
                value={phone}
                onChange={onPhoneChange}
              />
              <div className={`hint ${/^\d{10}$/.test(phone) ? "ok" : "bad"}`}>
                {phone.length === 0 ? "Bắt buộc nhập."
                  : /^\d{10}$/.test(phone) ? "Hợp lệ."
                    : "Phải đúng 10 số."}
              </div>
            </div>

            {err && <div className="form-error">{err}</div>}

            <div className="actions">
              <button type="button" className="btn ghost" onClick={() => nav(-1)}>
                Quay lại trang kết quả
              </button>
              <button type="submit" className="btn primary" disabled={!allValid || loading}>
                {loading ? "Đang đặt..." : "Đặt vé"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT – Cột giá */}
        <aside className="booking-right">
          <div className="box price-box">
            <div className="box-header">Chi tiết giá vé</div>

            {paxAdults > 0 && (
              <div className="price-row">
                <span>Giá vé người lớn ({paxAdults} x)</span>
                <strong>{money(pricePerAdult * paxAdults)}</strong>
              </div>
            )}
            {paxChildren > 0 && (
              <div className="price-row">
                <span>Giá vé trẻ em ({paxChildren} x)</span>
                <strong>{money(pricePerChild * paxChildren)}</strong>
              </div>
            )}
            {paxInfants > 0 && (
              <div className="price-row">
                <span>Giá vé em bé ({paxInfants} x)</span>
                <strong>{money(pricePerInfant * paxInfants)}</strong>
              </div>
            )}

            <div className="price-row">
              <span>Thuế & Phí</span>
              <strong>{money(0)}</strong>
            </div>

            <button
              className="voucher"
              type="button"
              disabled={voucherApplied || subTotal === 0}
              onClick={() => setVoucherApplied(true)}
            >
              {voucherApplied ? "Đã kích hoạt Voucher 20%" : "Kích hoạt Voucher 20%"}
            </button>
            <div className="voucher-note">
              Khuyến mãi cho khách hàng khi dùng mã voucher giảm 20% cho mỗi chuyến bay.
              Áp dụng khi còn suất ưu đãi.
            </div>

            <div className="total">
              <div>TỔNG CỘNG</div>
              <div className="total-number">{money(grandTotal)}</div>
            </div>

            <div className="included">
              <div className="included-title">GIÁ VÉ ĐÃ BAO GỒM THUẾ PHÍ</div>
              <ul>
                <li>Không phát sinh thêm bất cứ chi phí nào khác</li>
                <li>Ưu tiên chọn chỗ cho Anh/Chị chỗ ngồi tốt nhất</li>
                <li>Hành lý được mang 7kg xách tay và 20kg ký gửi (Vé Trong Nước)</li>
                <li>Hành lý được mang 7kg xách tay và 40kg ký gửi (Vé Quốc Tế)</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
