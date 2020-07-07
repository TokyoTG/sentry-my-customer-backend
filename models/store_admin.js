const mongoose = require("mongoose"),
  Store = require("./store"),
  StoreAssistant = require("./storeAssistant"),
  Complaints = require("./complaint_form");

const storeAdminSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true },
  local: {
    phone_number: { type: Number, unique: true },
    first_name: { type: String, default: "Not set" },
    last_name: { type: String, default: "Not set" },
    email: { type: String, default: "Not set" },
    is_active: { type: Boolean, default: 0 },
    password: { type: String },
    user_role: { type: String, default: "store_admin" },
  },
  google: {
    googleId: { type: String },
    api_token: String,
    user_role: { type: String, default: "store_admin" },
  },
  facebook: {
    facebookId: { type: String },
    //facebook login data
    user_role: {
      type: String,
      default: "store_admin",
    },
  },
  assistants: [StoreAssistant.schema],
  stores: [Store.schema],
  complaints: [Complaints.schema], // To take in Complaints and save to DB
  api_token: {
    type: String,
  },
});

module.exports = mongoose.model("store_admin", storeAdminSchema);
