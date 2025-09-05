import React, { useEffect, useState } from "react";
import "../styles/layout/header.css";

const NavLinks = () => (
  <>
    <a href="/" className="nav-link active">Trang Chủ</a>
    <a href="/" className="nav-link">Xem Lại Đơn Hàng</a>
    <a href="/" className="nav-link">Tiện Ích</a>
    <a href="/" className="nav-link">Liên Hệ</a>
  </>
);

export default function Header() {
  // Modal "Liên hệ"
  const [contactOpen, setContactOpen] = useState(false);
  // Off-canvas menu (mobile)
  const [menuOpen, setMenuOpen] = useState(false);

  // Esc đóng modal/menus
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setContactOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Khoá cuộn khi mở menu
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  return (
    <header className="topbar">
      <div className="container">
        <div className="topbar-inner">
          {/* Logo tròn trắng */}
          <a href="/" className="logo" aria-label="Trang chủ">
            <span className="badge">
              <img
                src="https://www.abay.vn/_Web/_File/Images/Layout/homeIcon.png"
                alt="Home"
              />
            </span>
          </a>

          {/* Menu desktop */}
          <nav className="nav nav-desktop" aria-label="Chính">
            <NavLinks />
          </nav>

          {/* Hotline -> mở modal Liên hệ (giữ code cũ) */}
          <button
            type="button"
            className="hotline-btn"
            aria-haspopup="dialog"
            aria-expanded={contactOpen ? "true" : "false"}
            onClick={() => setContactOpen(true)}
          >
            <span className="ic" aria-hidden>📞</span>
            <span className="text">
              HOTLINE Đặt Vé: <strong>097.688.8888</strong>
            </span>
          </button>

          {/* Hamburger chỉ hiện ở mobile */}
          <button
            className="hamburger"
            aria-label="Mở menu"
            aria-expanded={menuOpen ? "true" : "false"}
            onClick={() => setMenuOpen(true)}
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Overlay + Offcanvas menu (mobile) */}
      {menuOpen && <div className="oc-overlay" onClick={() => setMenuOpen(false)} />}
      <aside className={`offcanvas ${menuOpen ? "show" : ""}`} aria-hidden={!menuOpen}>
        <div className="oc-header">
          <span>Menu</span>
          <button className="oc-close" onClick={() => setMenuOpen(false)} aria-label="Đóng">✕</button>
        </div>
        <nav className="oc-nav">
          <NavLinks />
          <a href="/" className="oc-btn-refund">Hoàn Tiền</a>
        </nav>
      </aside>

      {/* MODAL Liên hệ (giữ style cũ) */}
      {contactOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
          onClick={(e) => {
            if (e.target.classList.contains("modal-overlay")) setContactOpen(false);
          }}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              aria-label="Đóng"
              onClick={() => setContactOpen(false)}
            >
              ✕
            </button>

            <h3 id="contact-title" className="modal-title">Liên hệ</h3>

            <div className="modal-actions">
              <a
                href="https://www.facebook.com/messages/t/464455963428285"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                HỖ TRỢ
              </a>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setContactOpen(false)}
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
