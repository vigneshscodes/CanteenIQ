import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";  
import Order from "./models/Order.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "public/images")));

/* =====================================================
   ⚙️  DATABASE CONNECTION
===================================================== */
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/canteeniqDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* =====================================================
   📘 SCHEMAS & MODELS
===================================================== */

// 🧍 USERS COLLECTION
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  contactnumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordhash: { type: String, required: true },
  createdat: { type: Date, default: Date.now },
  lastlogin: { type: Date },
});
const User = mongoose.model("User", userSchema);

// 🧑‍💼 MANAGERS COLLECTION
const managerSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  contactnumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordhash: { type: String, required: true },
  createdat: { type: Date, default: Date.now },
  lastlogin: { type: Date },
});
const Manager = mongoose.model("Manager", managerSchema);

// 🍔 ITEMS COLLECTION
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imgurl: { type: String },
  availableQty: { type: Number, required: true },
  createdat: { type: Date, default: Date.now },
  updatedat: { type: Date, default: Date.now },
});
const Item = mongoose.model("Item", itemSchema);


// 💳 TRANSACTIONS COLLECTION
const transactionSchema = new mongoose.Schema({
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  paidat: { type: Date },
});
const Transaction = mongoose.model("Transaction", transactionSchema);

/* =====================================================
   📡 API ROUTES
===================================================== */

// Test route
app.get("/", (req, res) => {
  res.send("🚀 CanteenIQ Backend is Running Successfully!");
});

/* ---------------- USERS ---------------- */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* ---------------- USERS ---------------- */

// Create new user (Signup)
app.post("/api/users", async (req, res) => {
  try {
    const { fullname, contactnumber, email, passwordhash } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const newUser = new User({
      fullname,
      contactnumber,
      email,
      passwordhash, // In production, hash this with bcrypt
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Users login
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.passwordhash !== password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  res.json({ message: "Login successful", user });
});

// Managers login
app.post("/api/managers/login", async (req, res) => {
  const { email, password } = req.body;
  const manager = await Manager.findOne({ email });
  if (!manager || manager.passwordhash !== password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  res.json({ message: "Login successful", manager });
});

/* ---------------- ITEMS ---------------- */

// Get all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add multiple items (for initial setup)
app.post("/api/items", async (req, res) => {
  try {
    const { name, price, availableQty, imgurl } = req.body;

    const newItem = new Item({
      name,
      price,
      availableQty: availableQty || 0,
      imgurl: imgurl || "/images/grapejuice.jpeg",
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item quantity
app.put("/api/items/:id", async (req, res) => {
  try {
    const { availableQty } = req.body;
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { availableQty, updatedat: Date.now() },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ---------------- ORDERS ---------------- */
// Get orders for a specific user
app.get("/api/orders", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    const orderno = 1000 + orderCount + 1;
    const tokenno = orderCount + 1;

    const newOrder = new Order({ ...req.body, orderno, tokenno });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.get("/api/orders/pending", async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "Pending" })
      .populate("userId", "fullname contactnumber")
      .lean()
      .sort({ createdAt: -1 });

    console.log("Pending Orders:", pendingOrders); // debug log
    res.json(Array.isArray(pendingOrders) ? pendingOrders : []);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ message: "Failed to fetch pending orders" });
  }
});

// Express + Mongoose
app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); // _id from MongoDB
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ---------------- TRANSACTIONS ---------------- */
app.post("/api/transactions", async (req, res) => {
  try {
    const newTransaction = new Transaction({
      ...req.body,
      paidat: new Date(),
      status: "paid",
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// ✅ Fetch all pending orders (for manager verify page)




// ✅ Verify OTP and complete the order
app.post("/api/orders/verify", async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    order.status = "Completed";
    await order.save();

    res.json({ message: "Order verified successfully", order });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: error.message });
  }
});
// ================= ANALYTICS ROUTE =================
app.get("/api/analytics", async (req, res) => {
  try {
    // Get all completed orders
    const completedOrders = await Order.find().populate("items.itemid");

    // Count total orders & revenue today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysOrders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const ordersToday = todaysOrders.length;
    const revenueToday = todaysOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Aggregate sold counts per item
    const itemSales = {};
    completedOrders.forEach((order) => {
      order.items.forEach((itemObj) => {
        const itemName = itemObj.itemId?.name;
        if (itemName) {
          itemSales[itemName] = (itemSales[itemName] || 0) + itemObj.quantity;
        }
      });
    });

    // Get current available quantities from Items collection
    const items = await Item.find();
    const analyticsData = Object.entries(itemSales).map(([name, sold]) => {
      const item = items.find((i) => i.name === name);
      return {
        name,
        sold,
        available: item ? item.availableQty : 0,
      };
    });

    res.json({
      bestSellingData: analyticsData,
      stats: {
        ordersToday,
        revenueToday,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
});

/* =====================================================
   🟢 START SERVER
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
