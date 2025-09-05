import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";

export default function App() {
  return (
    <>
      <Header />

      {/* Dải nền trắng full-width bọc thân */}
      <main className="page-band">
        <div className="container page-band__inner">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ket-qua" element={<Results />} />
            <Route path="/dat-ve" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </>
  );
}
