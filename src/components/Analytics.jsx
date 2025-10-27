import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import LoginBG from "../assets/loginbgtemp.png";

export default function Analytics() {
  const navigate = useNavigate();
  const [bestSellingData, setBestSellingData] = useState([]);
  const [stats, setStats] = useState({ ordersToday: 0, revenueToday: 0 });
  const COLORS = ["#b94419", "#e5b141", "#199b74", "#56473a", "#f7c59f"];

  // Fetch analytics from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setBestSellingData(data.bestSellingData || []);
        setStats({
          ordersToday: data.stats.ordersToday || 0,
          revenueToday: data.stats.revenueToday || 0,
        });
      })
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  // Sold items for Pie Chart
  const soldItemsData = bestSellingData.map((item) => ({
    name: item.name,
    value: item.sold,
  }));

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
        className="mb-6 bg-[#e5b141]/80 text-[#dbd9d5] px-5 py-2 rounded-full shadow-md flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <h1 className="text-3xl font-bold text-center text-white mb-10">
        Canteen Analytics Dashboard
      </h1>

      {/* Top Stats */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#e5b141] border border-[#b94419] rounded-2xl shadow-md p-5 flex flex-col items-center text-center">
          <p className="text-[#56473a] font-semibold">Orders Today</p>
          <h3 className="text-xl font-bold text-[#b94419] mt-1">{stats.ordersToday}</h3>
        </div>
        <div className="bg-[#e5b141] border border-[#b94419] rounded-2xl shadow-md p-5 flex flex-col items-center text-center">
          <p className="text-[#56473a] font-semibold">Revenue Today</p>
          <h3 className="text-xl font-bold text-[#b94419] mt-1">₹{stats.revenueToday}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Bar Chart */}
        <div className="bg-[#dbd9d5]/80 border border-[#b94419]/40 rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#56473a] mb-4 text-center">
            Best Selling Items
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestSellingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#b94419" />
              <XAxis dataKey="name" stroke="#56473a" />
              <YAxis stroke="#56473a" />
              <Tooltip contentStyle={{ backgroundColor: "#e5b141", border: "1px solid #b94419" }} />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="sold" fill="#199b74" name="Sold" barSize={25} radius={[10, 10, 0, 0]} />
              <Bar dataKey="available" fill="#996c0bff" name="Available" barSize={25} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#dbd9d5]/80 border border-[#b94419]/40 rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#56473a] mb-4 text-center">
            Sold Items Ratio Today
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={soldItemsData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {soldItemsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-center text-[#56473a]/70 mt-10 text-sm">
        CanteenIQ Analytics • Tracking orders, sales, and availability in real-time
      </p>
    </div>
  );
}
