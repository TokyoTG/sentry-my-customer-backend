const mongoose = require('mongoose')

const User = new mongoose.Schema({
  phone_number: { type: Number, unique: true }, 
  first_name: { type: String, required: true }, 
  last_name: { type: String, required: true }, 
  email: { type: String, required: true,  unique: true }, 
  is_active: { type: Boolean, default: 0 },
  password: { type: String }, 
  googleId: { type: String },
  api_token: String, 
  user_role: { type: String, default: "store_admin" }
}, { timestamps: true})

module.exports = mongoose.model('user', User)