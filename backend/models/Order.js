// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderno: { type: Number, required: true },
  items: [
    {
      itemid: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      imgurl: { type: String },
    },
  ],
  totalamt: { type: Number, required: true },
  ordertype: { type: String, enum: ["DineIn", "Parcel"], required: true },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  tokenno: Number,
  counterno: Number,
  expectedDelvtime: Date,
  otp: String,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
