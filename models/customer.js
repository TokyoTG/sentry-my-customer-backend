const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customer = mongoose.Schema({
  user_ref_id: { type: Schema.Types.ObjectId, ref: 'user' },
  name: { type: String, required: true},
  phone_number: { type: Number, required: true},
  email: { type: String, default: "Not set"}
}, { timestamps: true})

module.exports = mongoose.model('customer', Customer)