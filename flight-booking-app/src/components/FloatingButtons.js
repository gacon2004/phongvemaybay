import React, { useEffect, useState } from "react";

/* ==== Config ảnh/icon của bạn ==== */
/* Đổi link thành ảnh thật của bạn (nên dùng PNG/SVG nền trong).
   Cung cấp thêm bản 2x để hiển thị sắc nét trên màn hình retina. */
const ICONS = {
  zalo: {
    src:  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1024px-Icon_of_Zalo.svg.png",
    src2: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1024px-Icon_of_Zalo.svg.png",
    alt:  "Zalo",
  },
  messenger: {
    src:  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/2048px-Facebook_Messenger_logo_2020.svg.png",
    src2: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/2048px-Facebook_Messenger_logo_2020.svg.png",
    alt:  "Messenger",
  },
};

const ZALO_QR_URL =
  "https://your-cdn-or-image-host.com/zalo-qr.png";   // Ảnh QR Zalo của bạn
const ZALO_LINK = "https://zalo.me/xxxxxxxx";          // Link chat Zalo của bạn
const HOTLINE = "0976888888";
const MESSENGER_LINK = "https://www.facebook.com/messages/t/464455963428285";

/* ==== Helper ==== */
const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

/* Component icon ảnh dùng chung */
const ImgIcon = ({ src, src2, alt = "", size = 34 }) => (
  <img
    src={src}
    srcSet={src2 ? `${src2} 2x` : undefined}
    alt={alt}
    width={size}
    height={size}
    loading="lazy"
    decoding="async"
    fetchPriority="low"
    style={{
      display: "block",
      width: size,
      height: size,
      objectFit: "contain",
    }}
  />
);

export default function FloatingHelp() {
  const [openZaloQR, setOpenZaloQR] = useState(false);

  // đóng modal bằng ESC
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setOpenZaloQR(false);
    if (openZaloQR) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [openZaloQR]);

  const openTel       = () => window.open(`tel:${HOTLINE}`);
  const openZalo      = () => (isMobile() ? window.open(ZALO_LINK, "_blank") : setOpenZaloQR(true));
  const openMessenger = () => window.open(MESSENGER_LINK, "_blank");

  return (
    <>
      <div className="floating-help">
        <p className="cskh-chip" >
          CSKH
        </p>

        <button
          className="fab fab-zalo"
          data-tip="Chat Zalo"
          aria-label="Chat Zalo"
          onClick={openZalo}
        >
          <ImgIcon src={ICONS.zalo.src} src2={ICONS.zalo.src2} alt={ICONS.zalo.alt} />
        </button>

        <button
          className="fab fab-msg"
          data-tip="Messenger"
          aria-label="Messenger"
          onClick={openMessenger}
        >
          <ImgIcon src={ICONS.messenger.src} src2={ICONS.messenger.src2} alt={ICONS.messenger.alt} />
        </button>
      </div>

      {/* Modal QR Zalo */}
      {openZaloQR && (
        <div className="modal-overlay" onClick={() => setOpenZaloQR(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Quét mã QR để chat Zalo"
          >
            <button
              className="modal-close"
              onClick={() => setOpenZaloQR(false)}
              aria-label="Đóng"
            >
              ✕
            </button>

            <div className="modal-title">Quét mã QR để chat Zalo</div>

            <div className="qr-wrap">
              <img src={ZALO_QR_URL} alt="QR Zalo" />
            </div>

            <button
              className="btn open-zalo"
              onClick={() => window.open(ZALO_LINK, "_blank")}
            >
              Mở Zalo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
