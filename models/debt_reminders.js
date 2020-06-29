const mongoose = require('mongoose')

const DebtReminder = new mongoose.Schema({
  phone_number: {
    type: Number,
    required: true,
    unique: true,
  },
  ts_ref_id: { type: mongoose.Schema.Types.ObjectId, ref: 'transaction' },
  message: { type: String, required: true },
  status: { type: String, required: true },
  expected_pay_date: { type: Date, default: Date.now() }
}, { timestamps: true })

module.exports = mongoose.model('debt_reminder', DebtReminder)