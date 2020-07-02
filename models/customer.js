const mongoose = require("mongoose"),
	Transaction = require("./transaction")


const customerSchema = new mongoose.Schema({
	name: { type: Number, required: true },
	phone_number: { type: String, default: "Not set" },
	email: { type: String, default: "Not set" },
	transactions: [
		Transaction.schema
	]
}, { timestamps: true });

module.exports = mongoose.model("customer", customerSchema);