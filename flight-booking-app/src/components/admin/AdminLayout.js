import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");

  const logout = () => {
    localStorage.removeItem("admin_logged");
    localStorage.removeItem("admin_user");
    nav("/admin", { replace: true });
  };

  return (
    <div className={`admin-root ${collapsed ? "is-collapsed" : ""}`}>
      {/* TOP BAR */}
      <header className="admin-top">
        <button className="icon-btn" onClick={() => setCollapsed(v => !v)} title="Thu gọn/ Mở rộng menu">
          ☰
        </button>
        <div className="brand" onClick={() => nav("/admin/tickets")}>✈️ Admin Panel</div>
        <div className="top-right">
          <span className="user">
            {user?.full_name || user?.username || "Admin"}
          </span>
          <button className="btn small" onClick={logout}>Đăng xuất</button>
        </div>
      </header>

      {/* SIDE BAR */}
      <aside className="admin-side">
        <nav className="menu">
          <NavItem to="/admin/tickets" icon="🧾" label="Tickets" />
          {/* Bạn có thể thêm các mục khác sau này: */}
          {/* <NavItem to="/admin/users" icon="👤" label="Users" /> */}
          {/* <NavItem to="/admin/settings" icon="⚙️" label="Cài đặt" /> */}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
    >
      <span className="icon">{icon}</span>
      <span className="text">{label}</span>
    </NavLink>
  );
}
