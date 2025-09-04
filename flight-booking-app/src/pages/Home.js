// src/pages/Home.jsx
import React from "react";
import SearchCard from "../components/SearchCard";
import DealsSidebar from "../components/DealsSidebar";
import PaymentMethods from "../components/PaymentMethods";
import FloatingButtons from "../components/FloatingButtons";

// CSS global (không phải CSS module)
import "../styles/homes/home.css";

const Home = () => {
  return (
    <>
      <main className="home-page">
        <div className="container">
          <div className="grid">
            <div className="left-col">
              <SearchCard />
            </div>
            <div className="right-col">
              <DealsSidebar />
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-box">
              <h3>Các hình thức mua vé máy bay giá rẻ</h3>
              <ol className="buy-steps">
                <li>Trực tiếp lên website, nhanh nhất - tiện nhất</li>
                <li>
                  Qua chat{" "}
                  <img
                    src="https://www.abay.vn/_Web/_File/Images/HomePageD/messenger.png"
                    alt="Messenger"
                  />
                </li>
              </ol>
            </div>

            <div className="payment-box">
              <h3>Các hình thức thanh toán</h3>
              <PaymentMethods />
            </div>
          </div>
        </div>
      </main>

      <FloatingButtons />
    </>
  );
};

export default Home;
