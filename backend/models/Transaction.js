const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Failed"], required: true },
  paidAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
