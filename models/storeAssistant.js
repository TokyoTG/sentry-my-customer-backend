const mongoose = require("mongoose")

//schema for store assistant
const storeAssistantSchema = new mongoose.Schema({
	phone_number: { type: Number }, 
	first_name: { type: String, default: "Not set"}, 
	last_name: { type: String, default:"Not set"}, 
	email: { type: String, default: "Not set"}, 
	is_active: { type: Boolean, default: 1 },
	password: { type: String, select: false },
	user_role: {
	type: String,
	default: "store_assistant"
	}
}, { timestamp: true });

module.exports = mongoose.model("storeAssistant", storeAssistantSchema);