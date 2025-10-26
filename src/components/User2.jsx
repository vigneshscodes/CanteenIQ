import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoginBG from "../assets/loginbgtemp.png";

export default function User2() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`); 
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
      alert("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [orderId]);

  if (loading) return <p className="text-center mt-20 text-[#56473a] font-semibold">Loading order details...</p>;
  if (!order) return <p className="text-center mt-20 text-[#56473a] font-semibold">Order not found.</p>;

  return (
    <div
      className="min-h-screen font-poppins p-10"
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

      {/* Order Card */}
      <div className="max-w-md mx-auto bg-[#e5b141] border border-[#b94419] rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Header */}
        <h2 className="text-2xl font-bold text-[#56473a] mb-4 text-center">
          Order #{order.orderno}
        </h2>

        {/* Items List */}
        <div className="mb-4 bg-[#dbd9d5] rounded-xl p-4 shadow-inner">
          <h3 className="font-semibold text-[#56473a] mb-2">Items Ordered:</h3>
          <ul className="list-disc list-inside">
            {order.items.map((item, index) => (
              <li key={index} className="text-[#199b74] font-medium mb-1">
                {item.name} - <span className="font-bold">₹{item.price} x {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Details */}
        <div className="space-y-2">
          <p className="font-bold text-[#56473a]">
            Amount Paid: <span className="text-[#199b74]">₹{order.totalamt}</span>
          </p>
          <p className="font-semibold text-[#56473a]">
            Counter No: <span className="text-[#b94419]">{order.counterno}</span>
          </p>
          <p className="font-semibold text-[#56473a]">
            Token No: <span className="text-[#b94419]">{order.tokenno}</span>
          </p>
          <p className="font-semibold text-[#56473a]">
            Pick-up Time: <span className="text-[#199b74] font-bold">{new Date(order.expectedDelvtime).toLocaleTimeString()}</span>
          </p>
          <p className="font-semibold text-[#56473a]">
            OTP: <span className="text-[#199b74] font-bold">{order.otp}</span>
          </p>
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
