const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
	amount: { type:String, required: true },
	interest: { type: String, default: "Not set" },
	total_amount: { type: String, required: true},
	description: { type: String, default: "Not set" },
	type: { type: String }
	///STORE///
});

module.exports = mongoose.model("transaction", transactionSchema);