import React, { useState, useEffect } from "react";
import Logo from "../assets/logofinalbg0.png";
import { PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Management1() {
  const navigate = useNavigate();

  const sections = [
    { title: "Today's Menu", id: "menu" },
    { title: "Best Selling", id: "best" },
    { title: "Delivery Management", id: "delivery" },
    { title: "Analytics", id: "analytics" },
  ];

  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const defaultImg = "/images/grapejuice.jpeg";

  // Fetch items from DB
  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Update quantity in DB
  const handleQtyChange = async (id, qty) => {
    setMenuItems(
      menuItems.map((item) =>
        item._id === id ? { ...item, availableQty: qty } : item
      )
    );

    try {
      await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableQty: Number(qty) }),
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity in DB");
    }
  };

  // Add new item to DB
  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItem,
          availableQty: 0,
          imgurl: defaultImg,
          price: 0,
        }),
      });

      const addedItem = await res.json();
      setMenuItems([...menuItems, addedItem]);
      setNewItem("");
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item to DB");
    }
  };

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Card = ({ item }) => (
    <div className="flex-shrink-0 bg-[#e5b141]/30 border border-[#b94419]/20 rounded-2xl p-4 w-52 text-center shadow-lg hover:scale-95 transition-transform duration-200">
      <img
        src={item.imgurl || defaultImg}
        alt={item.name}
        draggable="false"
        className="w-full h-32 object-cover rounded-xl mb-3"
      />
      <h3 className="font-semibold text-[#56473a]">{item.name}</h3>
      <div className="flex justify-center items-center gap-2 mt-2">
        <input
          type="number"
          min="0"
          value={item.availableQty || 0}
          onChange={(e) => handleQtyChange(item._id, e.target.value)}
          className="w-20 text-center border border-[#b94419]/50 rounded-lg px-2 py-1 text-[#56473a] bg-[#dbd9d5] focus:border-[#199b74] focus:ring-2 focus:ring-[#199b74]/50 outline-none transition-all duration-200 hover:border-[#199b74] shadow-inner"
        />
      </div>
      <p className="text-[#199b74] font-semibold mt-2">
        Available: {item.availableQty || 0}
      </p>
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

      {/* Section: Today's Menu */}
      <section id="menu" className="px-10 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#56473a]">Add Items to Today’s Menu</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-full border border-[#b94419]/30 focus:outline-none focus:ring-2 focus:ring-[#199b74]"
            />
            <button className="bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] p-2 rounded-full transition">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {filteredMenu.map((item) => (
              <Card key={item._id} item={item} />
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
          key={item._id}
          className="flex-shrink-0 bg-[#dbd9d5] border border-[#b94419]/30 rounded-2xl p-4 w-52 text-center shadow-lg hover:bg-[#e5b141]/30 transition"
        >
          <img
            src={item.imgurl || defaultImg}
            alt={item.name}
            className="w-full h-32 object-cover rounded-xl mb-3"
          />
          <h3 className="font-bold text-[#56473a]">{item.name}</h3>
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
          className="max-w-3xl mx-auto bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] text-center rounded-3xl py-6 font-bold text-xl shadow-md transition-colors duration-300 cursor-pointer"
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
