import React, { useState, useEffect } from "react";
import Logo from "../assets/logofinalbg0.png";
import { ArrowRight, Search, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function User1() {
  let tokenCounter = 1;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const sections = [
    { title: "Items List", id: "items" },
    { title: "Best Selling", id: "best" },
    { title: "Previous Orders", id: "previous" },
    { title: "Cart", id: "cart" },
    { title: "Orders to Pick", id: "current" },
  ];

  const location = useLocation();
  const user = location.state?.user || null;

  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDineModal, setShowDineModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  // Fetch items
  useEffect(() => {
    fetch("${process.env.REACT_APP_API_URL}/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch orders
  useEffect(() => {
    if (!user) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/orders?userId=${user._id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, [user]);

  // Search
  const handleSearch = () => {
    const query = searchTerm.toLowerCase().trim();
    setFilteredItems(
      !query ? items : items.filter((i) => i.name.toLowerCase().includes(query))
    );
  };

  // Cart
  const confirmAddToCart = () => {
    if (!selectedItem) return;
    setCartItems([...cartItems, { ...selectedItem, quantity }]);
    setShowQtyModal(false);
  };

  const removeFromCart = (id) =>
    setCartItems(cartItems.filter((item) => item._id !== id));

  const checkout = () => {
    if (cartItems.length === 0) return;
    setShowDineModal(true);
  };

  const handleDineSelection = (type) => {
    setSelectedType(type);
    setShowDineModal(false);
    setShowPaymentModal(true);
  };

  // Place order
  const confirmPayment = async () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      if (!user) return alert("User not found");

      const orderData = {
        userId: user._id,
        items: cartItems.map((item) => ({
          itemid: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imgurl: item.imgurl,
        })),
        totalamt: total,
        ordertype: selectedType,
        status: "Pending",
        counterno: Math.floor(Math.random() * 5) + 1,
        tokenno: tokenCounter++,
        expectedDelvtime: new Date(Date.now() + 10 * 60000),
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
      };

      const res = await fetch("${process.env.REACT_APP_API_URL}/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const order = await res.json();

      await Promise.all(
        cartItems.map((item) =>
          fetch(`${process.env.REACT_APP_API_URL}/api/items/${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              availableQty: item.availableQty - item.quantity,
            }),
          })
        )
      );

      await fetch("${process.env.REACT_APP_API_URL}/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: order._id,
          userID: user._id,
          amount: total,
        }),
      });

      setOrders([...orders, order]);
      setCartItems([]);
      setShowPaymentModal(false);
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  // Card UI
  const Card = ({ item, buttonLabel, buttonColor, buttonHover, showPrice = true, onClick }) => (
    <div className="flex-shrink-0 bg-[#e5b141]/30 border border-[#b94419]/20 rounded-2xl p-4 w-52 text-center shadow-lg hover:scale-95 transition">
      {item.imgurl && (
        <img src={item.imgurl} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-3" />
      )}
      <h3 className="font-semibold text-[#56473a]">{item.name}</h3>
      {showPrice && <p className="text-[#199b74] font-bold">₹{item.price}</p>}
      {item.availableQty > 0 ? (
        <button onClick={onClick} className={`mt-2 ${buttonColor} text-white px-4 py-1 rounded-full hover:${buttonHover}`}>
          {buttonLabel}
        </button>
      ) : (
        <button disabled className="mt-2 bg-gray-400 text-white px-4 py-1 rounded-full">Sold Out</button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#dbd9d5] font-poppins">

      {/* HEADER */}
      <header className="flex flex-col items-center py-4 bg-[#e5b141] shadow-md relative">
        <img src={Logo} alt="logo" className="h-20 mb-2" />

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-6 bg-[#b94419] text-[#dbd9d5] px-4 py-1 rounded-full hover:bg-[#199b74]"
        >
          Logout
        </button>

        <nav className="flex gap-6 text-[#56473a] font-semibold text-lg">
          {sections.map((sec) => (
            <a key={sec.id} href={`#${sec.id}`}>
              {sec.title}
            </a>
          ))}
        </nav>
      </header>

      {/* Items List */}
      <section id="items" className="px-10 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#56473a]">Items List</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-full border border-[#b94419]/30 focus:outline-none focus:ring-2 focus:ring-[#199b74]"
            />
            <button
              onClick={handleSearch}
              className="bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] p-2 rounded-full transition"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {filteredItems.map((item) => (
              <Card
                key={item._id}
                item={item}
                buttonLabel="Add to Cart"
                buttonColor="bg-[#199b74]"
                buttonHover="bg-[#b94419]"
                onClick={() => {
                  setSelectedItem(item);
                  setQuantity(1);
                  setShowQtyModal(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Best Selling */}
      <section id="best" className="px-10 py-8 bg-[#e5b141]/20">
        <h2 className="text-2xl font-bold text-[#56473a] mb-4">Best Selling</h2>
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {items.slice(0, 5).map((item) => (
              <Card
                key={item._id}
                item={item}
                buttonLabel="Add to Cart"
                buttonColor="bg-[#199b74]"
                buttonHover="bg-[#b94419]"
                onClick={() => {
                  setSelectedItem(item);
                  setQuantity(1);
                  setShowQtyModal(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Previous Orders */}
      <section id="previous" className="px-10 py-8">
        <h2 className="text-2xl font-bold text-[#56473a] mb-4">Previous Orders</h2>
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div className="flex gap-6 overflow-visible">
            {orders.slice(-5).map((order) =>
              order.items?.map((item) => (
                <Card
                  key={item.itemid} // or item._id if present
                  item={{
                    name: item.name,
                    imgurl: item.imgurl || "", // fallback if imgurl missing
                    price: item.price,
                    availableQty: 1,
                  }}
                  showPrice={true}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Cart */}
      <section id="cart" className="px-10 py-8 bg-[#e5b141]/20">
        <h2 className="text-2xl font-bold text-[#56473a] mb-4">Your Cart</h2>
        <div className="flex flex-col gap-4">
          {cartItems?.length === 0 && <p className="text-[#56473a]/70">Cart is empty</p>}
          {cartItems.map((item, idx) => (
            <div key={idx} className="bg-[#dbd9d5] border border-[#b94419]/30 rounded-2xl p-5 flex justify-between items-center shadow-lg hover:bg-[#e5b141]/30 transition">
              <div className="flex items-center gap-4">
                <img src={item.imgurl} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                <div>
                  <h3 className="font-bold text-[#56473a]">{item.name}</h3>
                  <p className="text-[#199b74] font-bold">
                    ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-[#b94419] text-[#dbd9d5] px-4 py-1 rounded-full hover:bg-[#199b74] transition"
              >
                Remove
              </button>
            </div>
          ))}
          {cartItems.length > 0 && (
            <div className="mt-4 flex justify-end gap-4 items-center">
              <p className="font-bold text-[#56473a]">
                Total: ₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
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

      {/* Orders to Pick */}
      <section id="current" className="px-10 py-8">
  <h2 className="text-2xl font-bold text-[#56473a] mb-4">Orders to Pick</h2>
  <div className="flex flex-wrap gap-6 justify-center">
    {orders
      .filter(order => order.status === "Pending") // only show pending orders
      .map(order => (
        <Link key={order._id} to={`/user2/${order._id}`}>
          <div className="bg-[#dbd9d5] border border-[#b94419]/30 rounded-2xl p-5 w-72 flex justify-between items-center shadow-lg hover:bg-[#e5b141]/30 transition">
            <div>
              <h3 className="font-bold text-[#56473a]">Order #{order.orderno}</h3>
              <p className="text-[#199b74] text-sm">
                {order.items?.length || 0} Items
              </p>
              <p className="text-[#56473a]/80 text-xs italic">{order.ordertype}</p>
            </div>
            <ArrowRight className="text-[#b94419] w-6 h-6" />
          </div>
        </Link>
      ))}
  </div>
</section>


      {/* Quantity Modal */}
      {showQtyModal && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#dbd9d5] p-6 rounded-2xl shadow-lg text-center w-72 relative">
            <button onClick={() => setShowQtyModal(false)} className="absolute top-3 right-3 text-[#b94419]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#56473a] mb-4">{selectedItem.name}</h3>
            <p className="mb-4 text-[#56473a]/80">Select Quantity:</p>
            <div className="flex justify-center items-center gap-4 mb-6">
              <button onClick={() => setQuantity(qty => Math.max(1, qty - 1))} className="bg-[#b94419] hover:bg-[#199b74] text-[#dbd9d5] px-3 py-1 rounded-full">-</button>
              <span className="text-[#56473a] font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(qty => qty + 1)} className="bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] px-3 py-1 rounded-full">+</button>
            </div>
            <button onClick={confirmAddToCart} className="bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] px-6 py-2 rounded-full transition">Add to Cart</button>
          </div>
        </div>
      )}

      {/* Dine-in / Parcel Modal */}
      {showDineModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#dbd9d5] p-8 rounded-2xl shadow-lg text-center w-80 relative">
            <button onClick={() => setShowDineModal(false)} className="absolute top-3 right-3 text-[#b94419]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#56473a] mb-4">Choose Order Type</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleDineSelection("DineIn")} className="bg-[#b94419] hover:bg-[#199b74] text-[#dbd9d5] px-4 py-2 rounded-full transition">Dine In</button>
              <button onClick={() => handleDineSelection("Parcel")} className="bg-[#b94419] hover:bg-[#199b74] text-[#dbd9d5] px-4 py-2 rounded-full transition">Parcel</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#dbd9d5] p-8 rounded-2xl shadow-lg text-center w-80 relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-3 right-3 text-[#b94419]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#56473a] mb-4">Proceed to Payment</h3>
            <p className="text-[#56473a]/80 mb-4">You chose: <span className="font-semibold">{selectedType}</span></p>
            <button onClick={confirmPayment} className="bg-[#199b74] hover:bg-[#b94419] text-[#dbd9d5] px-6 py-2 rounded-full transition">Pay Now</button>
          </div>
        </div>
      )}

      <footer className="text-center py-4 text-[#56473a]/80 text-sm bg-[#e5b141]/30">
        CanteenIQ — Smart Canteen Ordering System - A Database Systems Project
      </footer>
    </div>
  );
}