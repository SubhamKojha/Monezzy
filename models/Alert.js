const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  email: String, // destination email for alerts
  type: { type: String, enum: ['monthly', 'daily'], required: true },
  limit: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);