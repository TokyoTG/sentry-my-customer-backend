const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserStore = mongoose.Schema({
  user_ref_id: { type: Schema.Types.ObjectId, ref: "user" },
  store_ref_id: { type: Schema.Types.ObjectId, ref: "store" },
});

module.exports = mongoose.model("user_store", UserStore);
