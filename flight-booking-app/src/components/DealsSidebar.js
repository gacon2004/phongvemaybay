import React from "react";

const DealsSidebar = () => {
  const deals = [
    { route: "Hà Nội - Đà Nẵng", price: "459,000 đ", airline: "Bamboo Airways" },
    { route: "TP Hồ Chí Minh - Hải Phòng", price: "704,000 đ", airline: "Vietnam Airlines" },
    { route: "TP Hồ Chí Minh - Nha Trang", price: "190,000 đ", airline: "Vietjet Air" },
  ];

  return (
    <aside className="deals">
      <div className="deals-banner">
        <img
          src="https://i.ibb.co/wNjPwSZm/dfsfsdf.jpg"
          alt="Vietravel Airlines Premium"
          className="plane-icon"
        />
      </div>

      <div className="deals-card">
        <div className="deals-card__title">Vé máy bay giá rẻ khách đặt mới nhất</div>
        <ul className="deal-list">
          {deals.map((d, i) => (
            <li key={i} className="deal-item">
              <div className="deal-route">{d.route}</div>
              <div className="deal-meta">
                <span className="deal-price">{d.price}</span>
                <span className="sep">•</span>
                <span className="deal-airline">{d.airline}</span>
                <a href="/" className="detail-link">Chi tiết</a>
              </div>
            </li>
          ))}
        </ul>
        <div className="deal-note">* Giá cơ bản cho 1 người chưa bao gồm thuế phí</div>
      </div>
    </aside>
  );
};

export default DealsSidebar;
