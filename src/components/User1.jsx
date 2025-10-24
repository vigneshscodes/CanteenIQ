import React, { useState } from "react";
import Logo from "../assets/logofinalbg0.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Import images
import idly from "../assets/idly.jpg";
import dosa from "../assets/dosa.jpg";
import poori from "../assets/poori.jpeg";
import chapathi from "../assets/chapathi.jpg";
import pongal from "../assets/pongal.jpg";
import parotta from "../assets/parotta.jpg";
import vegrice from "../assets/vegrice.png";
import meals from "../assets/meals.jpg";
import sambharrice from "../assets/sambharrice.jpg";
import curdrice from "../assets/curdrice.jpg";

export default function User1() {
  const sections = [
    { title: "Items List", id: "items" },
    { title: "Best Selling", id: "best" },
    { title: "Previous Orders", id: "previous" },
    { title: "Cart", id: "cart" },
    { title: "Orders to Pick", id: "current" },
  ];

  const items = [
    { id: 1, name: "Idly", price: 30, img: idly },
    { id: 2, name: "Dosa", price: 40, img: dosa },
    { id: 3, name: "Poori", price: 45, img: poori },
    { id: 4, name: "Chapathi", price: 50, img: chapathi },
    { id: 5, name: "Pongal", price: 35, img: pongal },
    { id: 6, name: "Parotta", price: 50, img: parotta },
    { id: 7, name: "Veg Rice", price: 60, img: vegrice },
    { id: 8, name: "Meals", price: 80, img: meals },
    { id: 9, name: "Sambar Rice", price: 50, img: sambharrice },
    { id: 10, name: "Curd Rice", price: 40, img: curdrice },
  ];

  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (item) => setCartItems([...cartItems, item]);
  const removeFromCart = (id) =>
    setCartItems(cartItems.filter((item) => item.id !== id));

  const checkout = () => {
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const newOrder = {
      id: `ORD${Math.floor(Math.random() * 1000)}`,
      details: `${cartItems.length} Items • ₹${total}`,
    };
    setOrders([...orders, newOrder]);
    setCartItems([]);
    alert("Order placed successfully!");
  };

  const Card = ({ item, buttonLabel, buttonColor, buttonHover, showPrice = true, onClick }) => (
  <div className="flex-shrink-0 bg-[#e5b141]/30 border border-[#b94419]/20 rounded-2xl p-4 w-52 text-center shadow-lg transform hover:scale-95 transition-transform duration-200">
    <img
      src={item.img}
      alt={item.name}
      draggable="false"
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-32 object-cover rounded-xl mb-3"
    />
    <h3 className="font-semibold text-[#56473a]">{item.name}</h3>
    {showPrice && <p className="text-[#199b74] font-bold">₹{item.price}</p>}
    {buttonLabel && (
      <button
        onClick={onClick}  // <-- Add this line
        className={`mt-2 ${buttonColor} text-[#dbd9d5] px-4 py-1 rounded-full hover:${buttonHover} transition`}
      >
        {buttonLabel}
      </button>
    )}
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

      {/* Section: Items List */}
      <section id="items" className="px-10 py-8">
        <h2 className="text-2xl font-bold text-[#56473a] mb-4">Items List</h2>
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {items.map((item) => (
              <Card
                key={item.id}
                item={item}
                buttonLabel="Add to Cart"
                buttonColor="bg-[#199b74]"
                buttonHover="bg-[#b94419]"
                onClick={() => addToCart(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section: Best Selling */}
      <section id="best" className="px-10 py-8 bg-[#e5b141]/20">
        <h2 className="text-2xl font-bold text-[#56473a] mb-4">Best Selling</h2>
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {items.slice(0, 5).map((item) => (
              <Card
                key={item.id}
                item={item}
                buttonLabel="Add to Cart"
                buttonColor="bg-[#199b74]"
                buttonHover="bg-[#b94419]"
                onClick={() => addToCart(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section: Previous Orders */}
      <section id="previous" className="px-10 py-8">
        <h2 className="text-2xl font-bold text-[#56473a] mb-4">
          Previous Orders
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {items.slice(2, 7).map((item) => (
              <Card key={item.id} item={item} showPrice={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Section: Cart */}
<section id="cart" className="px-10 py-8 bg-[#e5b141]/10">
  <h2 className="text-2xl font-bold text-[#56473a] mb-4">Your Cart</h2>
  <div className="flex flex-col gap-4">
    {cartItems.length === 0 && (
      <p className="text-[#56473a]/70">Cart is empty</p>
    )}
    {cartItems.map((item) => (
      <div
        key={item.id}
        className="bg-[#dbd9d5] border border-[#b94419]/30 rounded-2xl p-5 flex justify-between items-center shadow-lg hover:bg-[#e5b141]/30 transition"
      >
        <div className="flex items-center gap-4">
          <img
            src={item.img}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-xl"
          />
          <div>
            <h3 className="font-bold text-[#56473a]">{item.name}</h3>
            <p className="text-[#199b74] font-bold">₹{item.price}</p>
          </div>
        </div>
        <button
          onClick={() => removeFromCart(item.id)}
          className="bg-[#b94419] text-[#dbd9d5] px-4 py-1 rounded-full hover:bg-[#199b74] transition"
        >
          Remove
        </button>
      </div>
    ))}
    {cartItems.length > 0 && (
      <div className="mt-4 flex justify-end gap-4 items-center">
        <p className="font-bold text-[#56473a]">
          Total: ₹{cartItems.reduce((sum, item) => sum + item.price, 0)}
        </p>
        <button
          onClick={checkout}
          className="bg-[#199b74] text-[#dbd9d5] px-6 py-2 rounded-full hover:bg-[#b94419] transition"
        >
          Checkout
        </button>
      </div>
    )}
  </div>
</section>


      {/* Section: Orders to Pick */}
      <section id="current" className="px-10 py-8 bg-[#e5b141]/20">
        <h2 className="text-2xl font-bold text-[#56473a] mb-4">
          Orders to Pick
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {orders.map((order) => (
  <Link key={order.id} to={`/user2/${order.id}`}>
    <div className="bg-[#dbd9d5] border border-[#b94419]/30 rounded-2xl p-5 w-72 flex justify-between items-center shadow-lg hover:bg-[#e5b141]/30 transition">
      <div>
        <h3 className="font-bold text-[#56473a]">Order #{order.id}</h3>
        <p className="text-[#199b74] text-sm">{order.details}</p>
      </div>
      <ArrowRight className="text-[#b94419] w-6 h-6" />
    </div>
  </Link>
))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-[#56473a]/80 text-sm bg-[#e5b141]/30">
        © {new Date().getFullYear()} CanteenIQ — Smart Canteen Ordering System
      </footer>
    </div>
  );
}
