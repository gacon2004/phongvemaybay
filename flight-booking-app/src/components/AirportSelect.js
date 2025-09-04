import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
  } from "react";
  import ReactDOM from "react-dom";
  import { AIRPORTS } from "../data/airports";
  
  // ✅ import đúng đường dẫn hiện đang có trong dự án của bạn
  import "../styles/homes/components/airport-select.css";
  
  /** Nhóm theo region để render dạng 5 cột */
  function groupByRegion(list) {
    return list.reduce((acc, a) => {
      (acc[a.region] ||= []).push(a);
      return acc;
    }, {});
  }
  
  export default function AirportSelect({
    placeholder = "Chọn điểm",
    value,          // ví dụ: "Hà Nội (HAN)"
    onSelect,       // callback(airport)
    align = "left", // "left" | "right"
  }) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const inputWrapRef = useRef(null);
    const inputRef = useRef(null);
    const panelRef = useRef(null);
  
    // vị trí panel (portal: fixed)
    const [pos, setPos] = useState({ top: 0, left: 0, width: 720 });
  
    /**  recalc được memo hóa để dùng trong deps */
    const recalc = useCallback(() => {
      if (!inputRef.current) return;
      const r = inputRef.current.getBoundingClientRect();
      const margin = 12; // chừa 2 bên
      const preferredW = Math.min(920, window.innerWidth - margin * 2);
      let left = r.left;
      if (align === "right") left = r.right - preferredW;
      left = Math.max(margin, Math.min(left, window.innerWidth - margin - preferredW));
      const top = r.bottom + 6;
      setPos({ top, left, width: preferredW });
    }, [align]);
  
    useLayoutEffect(() => {
      if (!open) return;
      recalc();
    }, [open, recalc]);
  
    useEffect(() => {
      if (!open) return;
      const onScroll = () => recalc();
      const onResize = () => recalc();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onResize, true);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onResize, true);
      };
    }, [open, recalc]);
  
    // Đóng khi click ra ngoài
    useEffect(() => {
      const onDoc = (e) => {
        if (!open) return;
        const insideInput = inputWrapRef.current?.contains(e.target);
        const insidePanel = panelRef.current?.contains(e.target);
        if (!insideInput && !insidePanel) setOpen(false);
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);
  
    const filtered = useMemo(() => {
      if (!q.trim()) return AIRPORTS;
      const k = q.toLowerCase();
      return AIRPORTS.filter(
        (a) =>
          a.city.toLowerCase().includes(k) ||
          a.name.toLowerCase().includes(k) ||
          a.code.toLowerCase().includes(k) ||
          a.country.toLowerCase().includes(k)
      );
    }, [q]);
  
    const grouped = useMemo(() => groupByRegion(filtered), [filtered]);
  
    const pick = (a) => {
      onSelect?.(a);
      setOpen(false);
      setQ("");
      inputRef.current?.blur();
    };
  
    return (
      <div className="airport-select" ref={inputWrapRef}>
        <input
          ref={inputRef}
          className="airport-input"
          placeholder={placeholder}
          value={open ? q : (value || "")}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            if (!open) setOpen(true);
          }}
        />
  
        {open &&
          ReactDOM.createPortal(
            <div
              ref={panelRef}
              className={`airport-panel portal ${align === "right" ? "right" : "left"}`}
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                width: pos.width,
                zIndex: 100000,
              }}
              role="listbox"
            >
              <div className="airport-panel__top">
                <input
                  className="airport-search"
                  placeholder="Tìm nhanh: tên TP / mã (VD: HAN)"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  autoFocus
                />
              </div>
  
              {q.trim() ? (
                <ul className="airport-list flat">
                  {filtered.slice(0, 200).map((a) => (
                    <li key={a.code} className="airport-item" onClick={() => pick(a)}>
                      <div className="airport-city">
                        {a.city} <span className="muted">({a.code})</span>
                      </div>
                      <div className="airport-sub">
                        {a.country} · {a.name}
                      </div>
                    </li>
                  ))}
                  {!filtered.length && (
                    <li className="airport-empty">Không tìm thấy sân bay phù hợp.</li>
                  )}
                </ul>
              ) : (
                <div className="airport-grid">
                  {Object.entries(grouped).map(([region, items]) => (
                    <div key={region} className="airport-col">
                      <div className="airport-region">{region}</div>
                      <ul className="airport-list">
                        {items.map((a) => (
                          <li key={region + a.code} className="airport-item" onClick={() => pick(a)}>
                            <div className="airport-city">
                              {a.city} <span className="muted">({a.code})</span>
                            </div>
                            <div className="airport-sub">{a.name}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>,
            document.body
          )}
      </div>
    );
  }
  