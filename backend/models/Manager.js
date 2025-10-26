const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  contactnumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordhash: { type: String, required: true },
  createdat: { type: Date, default: Date.now },
  lastlogin: { type: Date },
});

module.exports = mongoose.model("Manager", managerSchema);
