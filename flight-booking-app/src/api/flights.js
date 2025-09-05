// flights.js
import axios from "axios";

/** Trả về YYYY-MM-DD theo múi giờ VN */
const vnISO = (d = new Date()) => {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d); // "YYYY-MM-DD"
};

/** Nhận "YYYY-MM-DD" | "DD/MM/YYYY" | Date -> YYYY-MM-DD theo VN */
export const toVnIsoDate = (val) => {
  if (!val) return "";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val; // đã đúng
    const m = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/.exec(val);
    if (m) {
      const dd = m[1].padStart(2, "0");
      const mm = m[2].padStart(2, "0");
      const yy = m[3];
      return `${yy}-${mm}-${dd}`;
    }
    // rơi vào trường hợp khác -> ép về VN
    try {
      return vnISO(new Date(val));
    } catch {
      return val;
    }
  }
  if (val instanceof Date) return vnISO(val);
  return String(val);
};

const api = axios.create({
  baseURL: "https://phongvemaybay247.com",
  timeout: 20000,
  headers: { "Content-Type": "application/json; charset=utf-8" },
});

/**
 * Gọi API tìm kiếm.
 * - Một chiều:  { from, to, date, adults, children, infants, tripType: "oneway" }
 * - Khứ hồi:    { ... + returnDate, date2 (alias), tripType: "roundtrip" }
 */
export async function searchFlights(form) {
  const depart = toVnIsoDate(form.departDate);
  const retn = toVnIsoDate(form.returnDate);
  const round = !!retn;

  const payload = {
    from: form.from,
    to: form.to,
    date: depart,
    adults: Number(form.adults) || 1,
    children: Number(form.children) || 0,
    infants: Number(form.infants) || 0,
    tripType: round ? "roundtrip" : "oneway",
    ...(round ? { retDate: retn } : {}), // <- đúng tên trường
  };

  const { data } = await api.post("/search", payload);
  return data;
}