import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Notice from "./pages/Notice";

export default function App() {
  const { pathname } = useLocation();

  // Những trang không muốn hiển thị Header/Footer
  const barePaths = ["/contact-page"];
  const isBare = barePaths.some((p) => pathname.startsWith(p));

  return (
    <>
      {!isBare && <Header />}

      {/* 
        - Normal pages: bọc bằng page-band + container
        - Bare pages: hiển thị full-width, không container để bạn tự dàn layout trong page
      */}
      <main className={isBare ? "bare-main" : "page-band"}>
        {isBare ? (
          <Routes>
            <Route path="/contact-page" element={<Notice />} />
            {/* vẫn có thể để các route khác ở đây nếu muốn full-width */}
            <Route path="/" element={<Home />} />
            <Route path="/flight" element={<Results />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        ) : (
          <div className="container page-band__inner">
            <Routes>
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
