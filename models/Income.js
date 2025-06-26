const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'General' },
  source: { type: String, enum: ['Salary', 'Freelancing', 'Passive', 'Other'], default: 'Other' },
  date: { type: Date, required: true },

  // Recurrence
  recurrence: { type: String, enum: ['One-time', 'Weekly', 'Monthly', 'Custom'], default: 'One-time' },
  customIntervalDays: { type: Number },
  active: { type: Boolean, default: true }, 
});

module.exports = mongoose.model('Income', incomeSchema);
