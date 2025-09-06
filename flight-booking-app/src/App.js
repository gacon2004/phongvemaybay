import { Routes, Route, useLocation } from "react-router-dom";
import "./styles/admin/admin.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Notice from "./pages/Notice";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminGuard from "./components/admin/AdminGuard"; // guard FE

export default function App() {
  const { pathname } = useLocation();

  // Những trang không muốn hiển thị Header/Footer
  // -> Ẩn header/footer cho cả khu vực admin
  const barePaths = ["/contact-page", "/admin"];
  const isBare = barePaths.some((p) => pathname.startsWith(p));

  return (
    <>
      {!isBare && <Header />}

      {/* 
        - Normal pages: bọc bằng page-band + container
        - Bare pages: full-width (tự dàn layout trong page)
      */}
      <main className={isBare ? "bare-main" : "page-band"}>
        {isBare ? (
          <Routes>
            {/* Bare routes */}
            <Route path="/contact-page" element={<Notice />} />

            {/* Admin routes (bare) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/tickets"
              element={
                <AdminGuard>
                  <AdminTickets />
                </AdminGuard>
              }
            />

            {/* Bạn vẫn có thể render các trang thường ở bare nếu muốn */}
            <Route path="/" element={<Home />} />
            <Route path="/flight" element={<Results />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        ) : (
          <div className="container page-band__inner">
            <Routes>
              {/* Normal routes */}
              <Route path="/" element={<Home />} />
              <Route path="/flight" element={<Results />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/contact-page" element={<Notice />} />
            </Routes>
          </div>
        )}
      </main>

      {!isBare && <Footer />}
    </>
  );
}
