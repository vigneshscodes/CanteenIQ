import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";  

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

// 🧾 ORDERS COLLECTION
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderno: { type: String, required: true, unique: true },
  items: [
    {
      itemid: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalamt: { type: Number, required: true },
  ordertype: { type: String, enum: ["DineIn", "Parcel"], default: "takeaway" },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  tokenno: { type: Number },
  counterno: { type: String },
  expectedDelvtime: { type: String },
  otp: { type: String },
  createdat: { type: Date, default: Date.now },
  updatedat: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

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
app.post("/api/items/bulk", async (req, res) => {
  try {
    const items = await Item.insertMany(req.body);
    res.status(201).json({ message: "✅ Items inserted successfully", data: items });
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

/* =====================================================
   🟢 START SERVER
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
