import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchFlights } from "../api/flights";
import "../styles/results/flights.css";
import "../styles/results/filters.css";

/* ===== helpers ===== */
const BASE = "https://phongvemaybay247.com";
const absLogo = (p) => (!p ? "" : /^https?:\/\//i.test(p) ? p : BASE + p);
const money = (n) =>
  (Number(n || 0))
    .toLocaleString("vi-VN", { maximumFractionDigits: 0 })
    .replaceAll(",", ".") + " đ";

const pickArray = (d) => {
  if (Array.isArray(d)) return d;
  for (const k of ["data", "list", "results", "items", "flights"])
    if (Array.isArray(d?.[k])) return d[k];
  return [];
};

const dayLabelVN = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dt);
};

const getBasePrice = (o) =>
  o?.priceDetails?.base != null
    ? Number(o.priceDetails.base)
    : o?.priceDetails?.total != null
    ? Number(o.priceDetails.total)
    : 0;

/** CHỈNH: kèm __raw + aircraft để đưa qua Booking đầy đủ */
const normalize = (o) => {
  const segs = Array.isArray(o.outboundSegments) ? o.outboundSegments : [];
  const first = segs[0] || {};
  const last = segs[segs.length - 1] || first;

  // suy aircraft nếu API có ở segment
  const aircraft =
    o.aircraft ||
    first?.aircraft ||
    last?.aircraft ||
    first?.plane ||
    last?.plane ||
    "";

  return {
    __raw: o, // GIỮ toàn bộ object gốc để Booking dùng
    priceDetails: o.priceDetails, // tiện cho Booking
    airlineLogo: absLogo(o.airlineLogo),
    airlineName: o.airlineName || "",
    departureTime: o.departureTime || first?.departure?.time || "",
    arrivalTime: o.arrivalTime || last?.arrival?.time || "",
    departureAirport: o.departureAirport || first?.departure?.airport || "",
    arrivalAirport: o.arrivalAirport || last?.arrival?.airport || "",
    totalDuration: o.totalDuration || last?.duration || "",
    stopsCount: Math.max(segs.length - 1, 0),
    price: getBasePrice(o),
    aircraft,
  };
};

const useFilterSort = (list, sort, setAirlines, directOnly) =>
  useMemo(() => {
    let arr = list;
    if (setAirlines.size) arr = arr.filter((f) => setAirlines.has(f.airlineName));
    else arr = [];
    if (directOnly) arr = arr.filter((f) => f.stopsCount === 0);

    switch (sort) {
      case "priceAsc":  return [...arr].sort((a, b) => a.price - b.price);
      case "priceDesc": return [...arr].sort((a, b) => b.price - a.price);
      case "early":     return [...arr].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      case "late":      return [...arr].sort((a, b) => b.departureTime.localeCompare(a.departureTime));
      default:          return arr;
    }
  }, [list, sort, setAirlines, directOnly]);

/* ===== Component ===== */
export default function Results() {
  const { state } = useLocation();
  const nav = useNavigate();

  const initialForm = state?.form || {
    from: "", to: "", from_label: "", to_label: "",
    departDate: "", returnDate: "", adults: 1, children: 0, infants: 0,
  };
  const initialData = state?.results;

  const [form] = useState(initialForm);
  const [oneway, setOneway] = useState([]);
  const [outbound, setOutbound] = useState([]); // đi
  const [inbound, setInbound] = useState([]);   // về
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");

  const [sort, setSort] = useState("recommended");
  const [selectedAirlines, setSelectedAirlines] = useState(new Set());
  const [directOnly, setDirectOnly] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    if (Array.isArray(initialData?.outbound) || Array.isArray(initialData?.inbound)) {
      setIsRoundTrip(true);
      setOutbound((initialData.outbound || []).map(normalize));
      setInbound((initialData.inbound || []).map(normalize));
    } else {
      setIsRoundTrip(false);
      setOneway(pickArray(initialData).map(normalize));
    }
    setLoading(false);
  }, [initialData]);

  // truy cập trực tiếp /ket-qua
  useEffect(() => {
    const needFetch = !initialData && form.from && form.to && form.departDate;
    if (!needFetch) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchFlights(form);
        if (Array.isArray(data?.outbound) || Array.isArray(data?.inbound)) {
          setIsRoundTrip(true);
          setOutbound((data.outbound || []).map(normalize));
          setInbound((data.inbound || []).map(normalize));
        } else {
          setIsRoundTrip(false);
          setOneway(pickArray(data).map(normalize));
        }
      } catch (e) {
        setError(e?.response?.data?.error || e.message || "Không tải được kết quả.");
      } finally {
        setLoading(false);
      }
    })();
  }, [initialData, form]);

  // danh sách hãng
  const airlineList = useMemo(() => {
    const names = isRoundTrip
      ? [...outbound, ...inbound].map((f) => f.airlineName)
      : oneway.map((f) => f.airlineName);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [oneway, outbound, inbound, isRoundTrip]);

  // mặc định chọn tất cả
  useEffect(() => {
    setSelectedAirlines(new Set(airlineList));
  }, [airlineList.length]);

  const owFiltered = useFilterSort(oneway,   sort, selectedAirlines, directOnly);
  const obFiltered = useFilterSort(outbound, sort, selectedAirlines, directOnly);
  const ibFiltered = useFilterSort(inbound,  sort, selectedAirlines, directOnly);

  const toggleAirline = (n) =>
    setSelectedAirlines((s) => {
      const x = new Set(s);
      x.has(n) ? x.delete(n) : x.add(n);
      return x;
    });
  const selectAll = () => setSelectedAirlines(new Set(airlineList));
  const clearAll  = () => setSelectedAirlines(new Set());

  /** TIỆN ÍCH: chuẩn hóa dữ liệu khi bấm Chọn để sang Booking */
  const toBookingState = (f) => {
    const r = f.__raw || f;
    return {
      form,
      flight: {
        // các field booking cần hiển thị ngay
        airlineName: f.airlineName,
        airlineLogo: f.airlineLogo,
        aircraft: f.aircraft || "Airbus A320",
        from_label: form.from_label || form.from,
        to_label:   form.to_label   || form.to,
        depTime: f.departureTime,
        arrTime: f.arrivalTime,
        depAirport: f.departureAirport,
        arrAirport: f.arrivalAirport,
        // mang theo thô để khi cần có thể đọc thêm trong Booking
        raw: r,
      },
      // chuyển cả priceDetails nếu API trả
      priceDetails: f.priceDetails || r?.priceDetails || {
        base: f.price || 0,
        taxes: 0,
        total: f.price || 0,
      },
    };
  };

  const FlightCard = ({ f }) => (
    <div className="flight-card">
      <div className="fc-left">
        <img className="fc-logo" src={f.airlineLogo} alt={f.airlineName} />
        <div className="fc-airline">{f.airlineName}</div>
      </div>
      <div className="fc-mid">
        <div className="fc-time">
          <span className="fc-dep">{f.departureTime}</span>
          <span className="fc-arrow"> ➔ </span>
          <span className="fc-arr">{f.arrivalTime}</span>
        </div>
        <div className="fc-meta">
          <span className="fc-dur">{f.totalDuration}</span>
          <span className="dot">•</span>
          <span className="fc-stop">{f.stopsCount === 0 ? "Bay thẳng" : `${f.stopsCount} điểm dừng`}</span>
        </div>
      </div>
      <div className="fc-right">
        <div className="fc-price">{f.price ? money(f.price) : "—"}</div>
        <button
          className="btn choose"
          onClick={() => nav("/booking", { state: toBookingState(f) })}
        >
          Chọn
        </button>
      </div>
    </div>
  );

  return (
    <div className="results-page container">
      <h2 className="results-title">
        {form.from_label || form.from} <span className="arrow">⇒</span> {form.to_label || form.to}
        {isRoundTrip && <>{"  ·  "}<span className="arrow">⇐</span> {form.from_label || form.from}</>}
      </h2>
      <div className="results-sub">
        {dayLabelVN(form.departDate)}{isRoundTrip && `  —  ${dayLabelVN(form.returnDate)}`}
      </div>

      <div className={isRoundTrip ? "rt-grid" : "r-grid"}>
        {!isRoundTrip ? (
          <div className="r-left">
            {loading && <div className="r-empty">Đang tải kết quả…</div>}
            {error && <div className="r-error">{error}</div>}
            {!loading && !error && owFiltered.map((f, i) => <FlightCard key={i} f={f} />)}
            {!loading && !error && owFiltered.length === 0 && <div className="r-empty">Không có chuyến bay phù hợp.</div>}
          </div>
        ) : (
          <>
            <div className="rt-col">
              <div className="rt-head">
                {(form.from_label || form.from)} → {(form.to_label || form.to)}<br />
                <span className="muted">{dayLabelVN(form.departDate)}</span>
              </div>
              {loading && <div className="r-empty">Đang tải kết quả…</div>}
              {error && <div className="r-error">{error}</div>}
              {!loading && !error && obFiltered.map((f, i) => <FlightCard key={i} f={f} />)}
              {!loading && !error && obFiltered.length === 0 && <div className="r-empty">Không có chuyến bay phù hợp.</div>}
            </div>

            <div className="rt-col">
              <div className="rt-head">
                {(form.to_label || form.to)} → {(form.from_label || form.from)}<br />
                <span className="muted">{dayLabelVN(form.returnDate)}</span>
              </div>
              {loading && <div className="r-empty">Đang tải kết quả…</div>}
              {error && <div className="r-error">{error}</div>}
              {!loading && !error && ibFiltered.map((f, i) => <FlightCard key={i} f={f} />)}
              {!loading && !error && ibFiltered.length === 0 && <div className="r-empty">Không có chuyến bay phù hợp.</div>}
            </div>
          </>
        )}

        <aside className="r-right">
          <div className="box">
            <div className="box-header">Sắp xếp</div>
            <label className="radio"><input type="radio" name="sort" checked={sort==="recommended"} onChange={()=>setSort("recommended")} /><span>PHONGVEMAYBAY247 đề xuất</span></label>
            <label className="radio"><input type="radio" name="sort" checked={sort==="priceAsc"}  onChange={()=>setSort("priceAsc")}  /><span>Giá (Thấp tới Cao)</span></label>
            <label className="radio"><input type="radio" name="sort" checked={sort==="priceDesc"} onChange={()=>setSort("priceDesc")} /><span>Giá (Cao tới Thấp)</span></label>
            <label className="radio"><input type="radio" name="sort" checked={sort==="early"}     onChange={()=>setSort("early")}     /><span>Thời gian khởi hành (Sớm)</span></label>
            <label className="radio"><input type="radio" name="sort" checked={sort==="late"}      onChange={()=>setSort("late")}      /><span>Thời gian khởi hành (Muộn)</span></label>
          </div>

          <div className="box">
            <div className="box-header">Lọc</div>
            <label className="check"><input type="checkbox" checked={directOnly} onChange={(e)=>setDirectOnly(e.target.checked)} /><span>Chỉ hiện bay thẳng</span></label>
            <div className="divider" />
            <div className="filter-actions">
              <button className="mini" onClick={selectAll} type="button">Chọn tất cả</button>
              <button className="mini ghost" onClick={clearAll} type="button">Bỏ tất cả</button>
            </div>
            {airlineList.map((n) => (
              <label key={n} className="check">
                <input type="checkbox" checked={selectedAirlines.has(n)} onChange={()=>toggleAirline(n)} />
                <span>{n}</span>
              </label>
            ))}
            {airlineList.length === 0 && <div className="muted">Không có danh sách hãng.</div>}
          </div>

          <div className="box">
            <div className="box-header">Thông tin tìm kiếm</div>
            <div className="mini-info">
              <div><strong>Điểm đi:</strong> {form.from_label || form.from}</div>
              <div><strong>Điểm đến:</strong> {form.to_label || form.to}</div>
              <div><strong>Ngày đi:</strong> {dayLabelVN(form.departDate)}</div>
              {!!form.returnDate && <div><strong>Ngày về:</strong> {dayLabelVN(form.returnDate)}</div>}
              <div><strong>Hành khách:</strong> NL {form.adults}, TE {form.children}, EB {form.infants}</div>
            </div>
            <button className="btn change" onClick={()=>nav(-1)} type="button">⟲ THAY ĐỔI TÌM KIẾM</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
