const mongoose = require('mongoose');

const recurringExpenseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true },
  amount: { 
    type: Number, 
    required: true },
  category: { 
    type: String },
  startDate: { 
    type: Date, 
    required: true },
  duration: { 
    type: Number, 
    required: true } // months
}, { timestamps: true });

module.exports = mongoose.model('RecurringExpense', recurringExpenseSchema);