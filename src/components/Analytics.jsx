import React from "react";
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
  Legend
} from "recharts";
import { ArrowLeft } from "lucide-react";
import LoginBG from "../assets/loginbgtemp.png";

export default function Analytics() {
  const navigate = useNavigate();

  // Dummy data
  const bestSellingData = [
    { name: "Dosa", sold: 240, available: 60 },
    { name: "Veg Rice", sold: 190, available: 50 },
    { name: "Poori", sold: 160, available: 40 },
    { name: "Curd Rice", sold: 120, available: 30 },
    { name: "Idly", sold: 100, available: 20 },
  ];

  // Only sold items for pie chart
  const soldItemsData = bestSellingData.map(item => ({ name: item.name, value: item.sold }));
  const COLORS = ["#b94419", "#e5b141", "#199b74", "#56473a", "#f7c59f"];

  const stats = [
    { title: "Orders Today", value: 120 },
    { title: "Revenue Today", value: "₹5,400" },
  ];

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
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-[#e5b141] border border-[#b94419] rounded-2xl shadow-md p-5 flex flex-col items-center text-center"
          >
            <p className="text-[#56473a] font-semibold">{s.title}</p>
            <h3 className="text-xl font-bold text-[#b94419] mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Bar Chart: Sold vs Available */}
        <div className="bg-[#dbd9d5]/80 border border-[#b94419]/40 rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#56473a] mb-4 text-center">
           Best Selling Items
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestSellingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#b94419" />
                <XAxis dataKey="name" stroke="#56473a" />
                <YAxis stroke="#56473a" />
                <Tooltip contentStyle={{ backgroundColor: "#e5b141", border: "1px solid #b94419" }} />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="sold" fill="#199b74" barSize={25} radius={[10, 10, 0, 0]} name="Sold" isAnimationActive={false} />
                <Bar dataKey="available" fill="#996c0bff" barSize={25} radius={[10, 10, 0, 0]} name="Available" isAnimationActive={false} />
            </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Pie Chart: Sold Items Only */}
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
                isAnimationActive={false}
                >
                {soldItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-[#56473a]/70 mt-10 text-sm">
        CanteenIQ Analytics • Tracking orders, sales, and availability in real-time
      </p>
    </div>
  );
}
