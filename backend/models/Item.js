const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imgurl: { type: String },
  availableQty: { type: Number, default: 0 },
  createdat: { type: Date, default: Date.now },
  updatedat: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", itemSchema);
