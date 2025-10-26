import React, { useEffect, useState } from "react";

export default function Verify() {
  const [orders, setOrders] = useState([]);
  const [enteredOtps, setEnteredOtps] = useState({});

  // Fetch pending orders on load
  useEffect(() => {
  fetch("http://localhost:5000/api/orders/pending")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) setOrders(data);
      else setOrders([]); // prevent crash
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
      setOrders([]);
    });
}, []);


  // Handle OTP input
  const handleOtpChange = (id, value) => {
    setEnteredOtps((prev) => ({ ...prev, [id]: value }));
  };

  // Verify order by OTP
  const verifyOrder = async (orderId) => {
    const otp = enteredOtps[orderId];
    if (!otp) {
      alert("Please enter OTP first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Order verified successfully!");
        setOrders((prev) => prev.filter((o) => o._id !== orderId)); // remove verified one
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error verifying order:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5b141] px-8 py-10 font-poppins">
      <h2 className="text-3xl font-bold text-[#56473a] mb-6">Verify Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No pending orders found ✅</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#dbd9d5] rounded-2xl shadow-md p-5 border border-[#b94419]/30"
            >
              <h3 className="text-xl font-bold text-[#56473a] mb-2">
                Token #{order.tokenno}
              </h3>
              <p className="text-sm mb-2">
                Customer: <span className="font-semibold">{order.userId?.fullname}</span>
              </p>
              <p className="text-sm mb-2">
                Type: <span className="font-semibold">{order.ordertype}</span>
              </p>
              <p className="text-sm mb-2">
                Total: ₹{order.totalamt}
              </p>
              <p className="text-sm mb-3 font-semibold">Items:</p>
              <ul className="text-sm text-[#56473a] mb-4">
                {order.items.map((it, i) => (
                  <li key={i}>
                    {it.name} × {it.quantity}
                  </li>
                ))}
              </ul>

              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                value={enteredOtps[order._id] || ""}
                onChange={(e) => handleOtpChange(order._id, e.target.value)}
              />

              <button
                onClick={() => verifyOrder(order._id)}
                className="w-full bg-[#b94419] text-white py-2 rounded-xl hover:bg-[#a53a15] transition"
              >
                Verify
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
