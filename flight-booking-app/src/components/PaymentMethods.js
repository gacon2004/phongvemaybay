import React from "react";

const PaymentMethods = () => {
  return (
    <ul className="pay-list">
      <li>
        <div className="qr-ico">
            <img 
               src="https://www.abay.vn/_Web/_File/Images/Icons/Icon_QR.png" 
               alt="QR Code"
            />
        </div>
        Thanh toán bằng QR Code
      </li>
      <li>
        <div className="bank-ico">
            <img 
               src="https://www.abay.vn/_Web/_File/Images/HomePageD/bank.jpg" 
               alt="Bank Transfer"
            />
        </div>
        Thanh toán qua chuyển khoản
      </li>
    </ul>
  );
};

export default PaymentMethods;
