import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import AdminGuard from "./components/admin/AdminGuard";

function AdminIndex() {
  // nếu muốn: đã login thì nhảy thẳng tickets
  const logged = localStorage.getItem("admin_logged") === "1";
  return <Navigate to={logged ? "/admin/tickets" : "/admin/login"} replace />;
}

export default function App() {
  const { pathname } = useLocation();

  // Ẩn header/footer cho cả khu vực admin
  const barePaths = ["/contact-page", "/admin"];
  const isBare = barePaths.some((p) => pathname.startsWith(p));
  const isAdmin = pathname.startsWith("/admin"); // <- cờ để gắn class khóa scroll

  return (
    <>
      {!isBare && <Header />}

      {/* 
        - Normal pages: page-band + container
        - Bare pages: full-width
        - Với admin: thêm class is-admin-route để khóa scroll của trang
      */}
      <main className={`${isBare ? "bare-main" : "page-band"} ${isAdmin ? "is-admin-route" : ""}`}>
        {isBare ? (
          <Routes>
            {/* Bare routes */}
            <Route path="/contact-page" element={<Notice />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/tickets"
              element={
                <AdminGuard>
                  <AdminTickets />
                </AdminGuard>
              }
            />

            {/* Có thể để các route thường ở bare nếu muốn */}
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
