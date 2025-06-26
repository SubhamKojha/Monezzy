const questionModel = require("../models/question-model");

// Show the chatting-style questionnaire
exports.getQuestions = (req, res) => {
  res.render("question"); // renders views/question.ejs
};

// Post collected answers from the frontend, compute ITR, and store
exports.postAnswer = async (req, res) => {
  const { answers } = req.body;

  const [
    resident, incomeLevel, source, houses,
    capitalGains, foreignIncome, unlistedShares, directorStatus,
    partnerStatus, freelanceIncome, presumptiveTax, agriIncome,
    deductions, crypto
  ] = answers;

  // Default form
  let recommendedForm = "ITR-2";

  // Decision logic for ITR-1 or ITR-4
  if (
    resident === "Resident (Indian)" &&
    incomeLevel === "Less than ₹50 lakh" &&
    source === "Salary / Pension" &&
    houses === "Yes, from one house" &&
    capitalGains === "No" &&
    foreignIncome === "No" &&
    unlistedShares === "No" &&
    directorStatus === "No" &&
    partnerStatus === "No"
  ) {
    recommendedForm = presumptiveTax === "Yes" ? "ITR-4" : "ITR-1";
  } else if (source === "Business or Profession" || partnerStatus === "Yes") {
    recommendedForm = presumptiveTax === "Yes" ? "ITR-4" : "ITR-3";
  }

  try {
    await questionModel.deleteMany(); // delete previous entries
    await questionModel.create({
      answers,
      recommendedForm,
      submittedAt: new Date()
    });

    // Redirect to result with form in query
    res.redirect(`/result?form=${recommendedForm}`);
  } catch (err) {
    console.error("Error saving questionnaire:", err);
    res.status(500).send("Failed to save questionnaire.");
  }
};

// Render result.ejs page
exports.showResult = async (req, res) => {
  const form = req.query.form;
  const validate = await questionModel.find().sort({ submittedAt: -1 });

  res.render("result", {
    result:null,
    data:null,
    form,
    validate
  });
};
//history
exports.getHistory = async (req, res) => {
  try {
    const responses = await questionModel.find().sort({ submittedAt: -1 });
    res.render("history", { responses });
  } catch (err) {
    console.error("Error loading history:", err);
    res.status(500).send("Error loading history.");
  }
};