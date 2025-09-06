import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = process.env.REACT_APP_API_URL || "";
const PAGE_SIZE = 7;

const money = (n) =>
  (Number(n || 0)).toLocaleString("vi-VN", { maximumFractionDigits: 0 })
    .replaceAll(",", ".") + " đ";

const fmtTime = (s) => {
  try {
    if (!s) return "";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleString("vi-VN");
  } catch { return s; }
};

export default function AdminTickets() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/info/full_infomation`);
      if (!res.ok) throw new Error(`GET /info/full_infomation ${res.status}`);
      const rows = await res.json();
      setData(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error(e);
      alert("Không tải được danh sách vé!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // tìm kiếm
  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return data;
    return data.filter((r) =>
      String(r.id).includes(k)
      || (r.name || "").toLowerCase().includes(k)
      || (r.sdt || "").toLowerCase().includes(k)
      || (r.chuyenbay || "").toLowerCase().includes(k)
    );
  }, [q, data]);

  // reset về trang 1 mỗi khi tìm kiếm / dữ liệu đổi
  useEffect(() => { setPage(1); }, [q, data]);

  // tính trang
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(Math.max(page, 1), totalPages);
  const sliceStart = (pageSafe - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(sliceStart, sliceStart + PAGE_SIZE);

  const setPageSafe = (p) => setPage(Math.min(Math.max(p, 1), totalPages));

  const del = async (id) => {
    if (!window.confirm(`Xóa vé #${id}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/info/delete_infomation?id=${id}`, { method: "POST" });
      if (!res.ok) throw new Error(`DELETE fail: ${res.status}`);
      const txt = await res.text();
      if (!/succcess|success/i.test(txt)) throw new Error(txt);

      // reload & nếu trang hiện tại rỗng sau khi xóa, lùi 1 trang
      await load();
      const nextCount = filtered.length - 1;
      const nextTotalPages = Math.max(1, Math.ceil(nextCount / PAGE_SIZE));
      if (page > nextTotalPages) setPage(nextTotalPages);
    } catch (e) {
      console.error(e);
      alert("Xóa không thành công!");
    }
  };

  return (
    <AdminLayout>
      <div className="content-head">
        <h2>Tickets</h2>
        <div className="actions">
          <input
            className="search"
            placeholder="Tìm ID / tên / sđt / chuyến bay…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Đang tải..." : "Tải lại"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>SĐT</th>
                <th>Chuyến bay</th>
                <th className="right">Giá</th>
                <th></th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted">
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </td>
                </tr>
              )}
              {pageItems.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.sdt}</td>
                  <td title={r.chuyenbay} className="ellipsis">{r.chuyenbay}</td>
                  <td className="right">{money(r.price)}</td>
                  <td>{fmtTime(r.created_at)}</td>
                  <td><button className="btn danger" onClick={()=>del(r.id)}>Xóa</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pg-info">
            Tổng {filtered.length} vé • Trang {pageSafe}/{totalPages}
          </div>
          <div className="pg-controls">
            <button className="pg-btn" onClick={()=>setPageSafe(1)} disabled={pageSafe===1}>«</button>
            <button className="pg-btn" onClick={()=>setPageSafe(pageSafe-1)} disabled={pageSafe===1}>‹</button>

            {visiblePages(pageSafe, totalPages).map(p => (
              <button
                key={p}
                className={`pg-btn num ${p===pageSafe ? "active" : ""}`}
                onClick={()=>setPageSafe(p)}
              >
                {p}
              </button>
            ))}

            <button className="pg-btn" onClick={()=>setPageSafe(pageSafe+1)} disabled={pageSafe===totalPages}>›</button>
            <button className="pg-btn" onClick={()=>setPageSafe(totalPages)} disabled={pageSafe===totalPages}>»</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/** Tạo dải số trang gọn: tối đa 5 nút quanh trang hiện tại */
function visiblePages(current, total) {
  const span = 2; // 2 trái + 2 phải = 5 nút
  const start = Math.max(1, current - span);
  const end = Math.min(total, current + span);
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}
