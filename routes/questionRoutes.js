const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

// Show chatting-style questionnaire
router.get("/questions", questionController.getQuestions);

// Handle answer submission and store in DB
router.post("/knowing", questionController.postAnswer);

// Show ITR result after processing
router.get("/result", questionController.showResult);

// (Optional) View all past responses
router.get("/history", questionController.getHistory);

module.exports = router;
