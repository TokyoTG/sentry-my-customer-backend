const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // Name of Complainer
  },
  email: {
    type: String,
    required: true,
    // Email of complainer
  },
  message: {
    type: String,
    required: true,
    // Message the complainer sends 
  },
  status: {
    type: String,
    default: 'Open'
  },
  date: {
    type: Date,
    default: Date.now 
  }
});


module.exports = mongoose.model('complaint_form', ComplaintSchema);