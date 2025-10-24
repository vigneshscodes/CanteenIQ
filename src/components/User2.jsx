import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoginBG from "../assets/loginbgtemp.png";

export default function User2() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = {
    id: orderId,
    items: [
      { name: "Dosa", price: 40 },
      { name: "Veg Rice", price: 60 },
    ],
    total: 100,
    counter: 3,
    token: 12,
    otp: 4567,
  };

  return (
    <div className="min-h-screen bg-[#dbd9d5] font-poppins p-10" style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-[#e5b141]/80 text-[#dbd9d5] px-5 py-2 rounded-full hover:bg-[#b94419] shadow-md transition-colors duration-200"
      >
        ← Back
      </button>

      {/* Order Card */}
      <div className="max-w-md mx-auto bg-[#e5b141] border border-[#b94419] rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Header */}
        <h2 className="text-2xl font-bold text-[#56473a] mb-4 text-center">
          Order #{order.id}
        </h2>

        {/* Items List */}
        <div className="mb-4 bg-[#dbd9d5] rounded-xl p-4 shadow-inner">
          <h3 className="font-semibold text-[#56473a] mb-2">Items Ordered:</h3>
          <ul className="list-disc list-inside">
            {order.items.map((item, index) => (
              <li key={index} className="text-[#199b74] font-medium mb-1">
                {item.name} - <span className="font-bold">₹{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Details */}
        <div className="space-y-2">
          <p className="font-bold text-[#56473a]">Amount Paid: <span className="text-[#199b74]">₹{order.total}</span></p>
          <p className="font-semibold text-[#56473a]">Counter No: <span className="text-[#b94419]">{order.counter}</span></p>
          <p className="font-semibold text-[#56473a]">Token No: <span className="text-[#b94419]">{order.token}</span></p>
          <p className="font-semibold text-[#56473a]">
            Pick-up Time: <span className="text-[#199b74] font-bold">{order.pickupTime}</span>
          </p>
          <p className="font-semibold text-[#56473a]">OTP: <span className="text-[#199b74] font-bold">{order.otp}</span></p>
        </div>

        <button
  onClick={() => alert("Enjoy your food! Have a good day.")}
  className="mt-6 w-full bg-[#199b74] text-[#dbd9d5] py-2 rounded-full hover:bg-[#b94419] font-semibold shadow-md transition-colors duration-200"
>
  OTP Verified!
</button>

      </div>
    </div>
  );
}
