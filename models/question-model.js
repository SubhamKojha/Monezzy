const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  answers: [String],
  recommendedForm: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("questionModel", questionSchema);
