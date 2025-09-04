// src/components/SearchCard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AirportSelect from "./AirportSelect";
import { searchFlights, toVnIsoDate } from "../api/flights";

const todayVNISO = () => toVnIsoDate(new Date());

export default function SearchCard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    from: "",
    to: "",
    from_label: "",
    to_label: "",
    departDate: todayVNISO(),  // auto hôm nay theo VN
    returnDate: "",            // rỗng = 1 chiều
    adults: 1,
    children: 0,
    infants: 0,
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const swap = () =>
    setForm((s) => ({
      ...s,
      from: s.to,
      to: s.from,
      from_label: s.to_label,
      to_label: s.from_label,
    }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    // validate cơ bản
    if (!form.from || !form.to) {
      setError("Vui lòng chọn điểm đi và điểm đến.");
      return;
    }
    if (form.returnDate) {
      const d1 = toVnIsoDate(form.departDate);
      const d2 = toVnIsoDate(form.returnDate);
      if (d2 < d1) {
        setError("Ngày về phải sau hoặc bằng ngày đi.");
        return;
      }
    }
    setLoading(true);
    try {
      const results = await searchFlights(form);
      nav("/ket-qua", { state: { form, results } });
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Không tìm được chuyến bay.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-card">
      <div className="search-card__title">✈️ VÉ MÁY BAY GIÁ RẺ</div>

      <form onSubmit={submit} className="search-form">
        {error && <div className="form-error">{error}</div>}

        <div className="row two">
          <div className="field">
            <label className="icon-label"><span className="i-plane" /> Điểm đi</label>
            <div className="input-group">
              <AirportSelect
                placeholder="Chọn điểm đi"
                value={form.from_label}
                onSelect={(a) =>
                  setForm((s) => ({
                    ...s,
                    from: a.code,
                    from_label: `${a.city} (${a.code})`,
                  }))
                }
                align="left"
              />
              <button type="button" className="swap" onClick={swap} title="Đổi chiều">⇄</button>
            </div>
          </div>

          <div className="field">
            <label className="icon-label right"><span className="i-plane" /> Điểm đến</label>
            <AirportSelect
              placeholder="Chọn điểm đến"
              value={form.to_label}
              onSelect={(a) =>
                setForm((s) => ({
                  ...s,
                  to: a.code,
                  to_label: `${a.city} (${a.code})`,
                }))
              }
              align="left"
            />
          </div>
        </div>

        <div className="row two">
          <div className="field">
            <label>Ngày đi</label>
            <input
              type="date"
              name="departDate"
              value={form.departDate}
              onChange={onChange}
              min={todayVNISO()}
            />
          </div>
          <div className="field">
            <div className="label-line">
              <label>Ngày về</label>
              <button
                type="button"
                className="link-clear"
                onClick={() => setForm((s) => ({ ...s, returnDate: "" }))}
                disabled={!form.returnDate}
              >
                Bỏ chọn
              </button>
            </div>
            <input
              type="date"
              name="returnDate"
              value={form.returnDate}
              onChange={onChange}
              min={form.departDate || todayVNISO()}
            />
          </div>
        </div>

        <div className="counts">
          <div className="count-col">
            <label>Người lớn</label>
            <input type="number" name="adults" min="1" value={form.adults} onChange={onChange} />
          </div>
          <div className="hint">(từ 12 tuổi trở lên)</div>

          <div className="count-col">
            <label>Trẻ em</label>
            <input type="number" name="children" min="0" value={form.children} onChange={onChange} />
          </div>
          <div className="hint">(từ 2 đến dưới 12)</div>

          <div className="count-col">
            <label>Em bé</label>
            <input type="number" name="infants" min="0" value={form.infants} onChange={onChange} />
          </div>
          <div className="hint">(Miễn phí dưới 2 tuổi)</div>
        </div>

        <div className="row actions">
          <span className="dot">•</span>
          <button type="button" className="btn ghost">Hoàn Tiền</button>
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Đang tìm..." : "🔎 TÌM CHUYẾN BAY"}
          </button>
        </div>

        <div className="promo">
          <img alt="banner" src="https://i.imgur.com/LKTwNnD.png" />
        </div>
      </form>
    </div>
  );
}
