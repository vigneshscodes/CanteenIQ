import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBG from "../assets/loginbgtemp.png";

export default function Verify() {
  const navigate = useNavigate();

  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: "101",
      items: [
        { name: "Dosa", price: 40 },
        { name: "Veg Rice", price: 60 },
      ],
      total: 100,
      counter: 3,
      token: 12,
      verified: false,
    },
    {
      id: "102",
      items: [
        { name: "Idly", price: 30 },
        { name: "Curd Rice", price: 50 },
      ],
      total: 80,
      counter: 2,
      token: 8,
      verified: false,
    },
    {
      id: "103",
      items: [{ name: "Poori", price: 45 }],
      total: 45,
      counter: 1,
      token: 5,
      verified: false,
    },
  ]);

  const [otpInputs, setOtpInputs] = useState({});

  const handleVerify = (orderId) => {
    const enteredOtp = otpInputs[orderId];
    if (enteredOtp === "1234") {
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, verified: true } : o
        )
      );
      alert(`Order #${orderId} verified successfully!`);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#dbd9d5] font-poppins p-10"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-[#e5b141]/80 text-[#dbd9d5] px-5 py-2 rounded-full hover:bg-[#b94419] shadow-md transition-colors duration-200"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-center text-white mb-10">
        Verify Orders (OTP: 1234)
      </h1>

      {/* Orders List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`bg-[#e5b141] border border-[#b94419] rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${
              order.verified ? "opacity-75" : ""
            }`}
          >
            <h2 className="text-xl font-bold text-[#56473a] mb-3 text-center">
              Order #{order.id}
            </h2>

            <div className="bg-[#dbd9d5] rounded-xl p-3 mb-4 shadow-inner">
              <h3 className="font-semibold text-[#56473a] mb-1">
                Items Ordered:
              </h3>
              <ul className="list-disc list-inside">
                {order.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-[#199b74] font-medium text-sm mb-1"
                  >
                    {item.name} - ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>

            <p className="font-bold text-[#56473a]">
              Amount Paid:{" "}
              <span className="text-[#199b74] font-semibold">
                ₹{order.total}
              </span>
            </p>
            <p className="font-semibold text-[#56473a]">
              Counter No: <span className="text-[#b94419]">{order.counter}</span>
            </p>
            <p className="font-semibold text-[#56473a]">
              Token No: <span className="text-[#b94419]">{order.token}</span>
            </p>

            {!order.verified ? (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpInputs[order.id] || ""}
                  onChange={(e) =>
                    setOtpInputs({ ...otpInputs, [order.id]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#b94419]/50 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#199b74]"
                />
                <button
                  onClick={() => handleVerify(order.id)}
                  className="mt-3 w-full bg-[#199b74] text-[#dbd9d5] py-2 rounded-full hover:bg-[#b94419] font-semibold shadow-md transition-colors duration-200"
                >
                  Verify OTP
                </button>
              </div>
            ) : (
              <div className="mt-4 w-full bg-[#199b74]/80 text-[#dbd9d5] py-2 rounded-full text-center font-semibold">
                OTP Verified
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
