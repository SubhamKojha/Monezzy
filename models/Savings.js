const mongoose = require('mongoose');

const SavingsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  target: { type: Number, required: true },
  saved: { type: Number, default: 0 },
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Savings', SavingsSchema);
