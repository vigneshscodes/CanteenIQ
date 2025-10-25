// Management1.jsx
import React, { useState } from "react";
import Logo from "../assets/logofinalbg0.png";
import { ArrowRight, PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import sample images
import dosa from "../assets/dosa.jpg";
import idly from "../assets/idly.jpg";
import poori from "../assets/poori.jpeg";
import vegrice from "../assets/vegrice.png";
import curdrice from "../assets/curdrice.jpg";

export default function Management1() {
  const navigate = useNavigate();

  const sections = [
    { title: "Today's Menu", id: "menu" },
    { title: "Best Selling", id: "best" },
    { title: "Delivery Management", id: "delivery" },
    { title: "Analytics", id: "analytics" },
  ];

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Dosa", qty: 20, img: dosa },
    { id: 2, name: "Idly", qty: 15, img: idly },
    { id: 3, name: "Poori", qty: 25, img: poori },
    { id: 4, name: "Veg Rice", qty: 30, img: vegrice },
    { id: 5, name: "Curd Rice", qty: 18, img: curdrice },
  ]);

  const [newItem, setNewItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setMenuItems([
        ...menuItems,
        {
          id: menuItems.length + 1,
          name: newItem,
          qty: 0,
          img: vegrice, // placeholder
        },
      ]);
      setNewItem("");
    }
  };

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Card = ({ item }) => (
    <div className="flex-shrink-0 bg-[#e5b141]/30 border border-[#b94419]/20 rounded-2xl p-4 w-52 text-center shadow-lg hover:scale-95 transition-transform duration-200">
      <img
        src={item.img}
        alt={item.name}
        draggable="false"
        className="w-full h-32 object-cover rounded-xl mb-3"
      />
      <h3 className="font-semibold text-[#56473a]">{item.name}</h3>
      <div className="flex justify-center items-center gap-2 mt-2">
        <input
          type="number"
          min="0"
          value={item.qty}
          onChange={(e) =>
            setMenuItems(
              menuItems.map((i) =>
                i.id === item.id ? { ...i, qty: e.target.value } : i
              )
            )
          }
          className="w-20 text-center border border-[#b94419]/50 rounded-lg px-2 py-1 text-[#56473a] bg-[#dbd9d5] focus:border-[#199b74] focus:ring-2 focus:ring-[#199b74]/50 outline-none transition-all duration-200 hover:border-[#199b74] shadow-inner"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#dbd9d5] font-poppins">
      {/* Header */}
      <header className="flex flex-col items-center py-4 bg-[#e5b141] shadow-md top-0 z-10">
        <img src={Logo} alt="CanteenIQ Logo" className="h-20 mb-2" />
        <nav className="flex flex-wrap justify-center gap-6 text-[#56473a] font-semibold text-lg">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="hover:text-[#199b74] transition-colors duration-200"
            >
              {sec.title}
            </a>
          ))}
        </nav>
      </header>

      {/* Section: Add to Today's Menu */}
      <section id="menu" className="px-10 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#56473a]">
            Add Items to Today’s Menu
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-full border border-[#b94419]/30 focus:outline-none focus:ring-2 focus:ring-[#199b74]"
            />
            <button
              onClick={() => {}}
              className="bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] p-2 rounded-full transition"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {filteredMenu.map((item) => (
              <Card key={item.id} item={item} />
            ))}

            {/* Add new item card */}
            <div className="flex flex-col justify-center items-center bg-[#199b74]/20 border border-[#199b74]/40 rounded-2xl p-6 w-52 text-center shadow-md hover:bg-[#199b74]/30 transition">
              <input
                type="text"
                placeholder="New item name..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="bg-transparent border-b border-[#56473a]/40 text-[#56473a] text-sm text-center focus:outline-none mb-3"
              />
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] px-3 py-1 rounded-full transition"
              >
                <PlusCircle className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Best Selling */}
      <section id="best" className="px-10 py-8 bg-[#e5b141]/20">
        <h2 className="text-2xl font-bold text-[#56473a] mb-4">
          Best Selling Items
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {menuItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 bg-[#dbd9d5] border border-[#b94419]/30 rounded-2xl p-4 w-52 text-center shadow-lg hover:bg-[#e5b141]/30 transition"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                />
                <h3 className="font-bold text-[#56473a]">{item.name}</h3>
                <p className="text-[#199b74] font-semibold">
                  {item.qty} available
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Delivery Management */}
      <section id="delivery" className="px-10 py-8">
        <h2 className="text-2xl font-bold text-[#56473a] mb-6 text-center">
          Delivery Management
        </h2>
        <div
          onClick={() => navigate("/otp")}
          className="max-w-3xl mx-auto bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] text-center rounded-3xl py-6 font-bold text-xl shadow-md transition-colors duration-300 cursor-pointer"
        >
          Go to OTP Verification & Delivery Page →
        </div>
      </section>

      {/* 🆕 Section: Order History & Analytics */}
      <section id="analytics" className="px-10 py-8 bg-[#e5b141]/20">
        <h2 className="text-2xl font-bold text-[#56473a] mb-6 text-center">
          Order History & Analytics
        </h2>
        <div
          onClick={() => navigate("/analytics")}
          className="max-w-3xl mx-auto bg-[#b94419] hover:bg-[#199b74] text-[#dbd9d5] text-center rounded-3xl py-6 font-bold text-xl shadow-md transition-colors duration-300 cursor-pointer"
        >
          See Order History & Analytics →
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-[#56473a]/80 text-sm bg-[#e5b141]/30">
        CanteenIQ — Management Portal • Smart Canteen System
      </footer>
    </div>
  );
}
