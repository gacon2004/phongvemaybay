import React from "react";
import "../styles/notice/notice.css";

export default function Notice() {
  const gotoFanpage = () => {
    // Thay link fanpage của bạn tại đây
    window.open("https://www.facebook.com/messages/t/464455963428285", "_blank", "noopener");
  };

  return (
    <div className="notice-wrap">
      <div className="notice-card" role="alert" aria-live="polite">
        <div className="notice-title">Thông báo</div>
        <p className="notice-text">
          Bạn đã hoàn tất việc đặt vé và thanh toán. Vui lòng liên hệ
          <strong> Fanpage</strong> hoặc <strong>Zalo</strong> để được duyệt vé sớm nhất.
        </p>

        <button type="button" className="notice-btn" onClick={gotoFanpage}>
          Đi đến Fanpage
        </button>
      </div>
    </div>
  );
}
