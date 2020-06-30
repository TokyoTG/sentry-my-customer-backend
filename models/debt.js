const mongoose = require("mongoose")

const debtSchema = new mongoose.Schema({
	//debt details
})

module.exports = mongoose.model("debt", debtSchema);