const mongoose = require('mongoose')

const User = new mongoose.Schema({
  first_name: { type: String, required: true }, 
  last_name: { type: String, required: true }, 
  email: { type: String, required: true,  unique: true }, 
  is_active: { type: Boolean, default: 0 },
  password: { type: String }, 
  googleId: { type: String },
  facebookId: { type: String },
  phone_number: { type: String }, 
  api_token: String, 
  user_role: { type: String, default: "store_admin" }
}, { timestamps: true})

module.exports = mongoose.model('user', User)