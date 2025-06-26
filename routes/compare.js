const express = require('express');
const router = express.Router();
const calculateEMI = require('../utils/emi');
const generateAnalysis = require('../utils/gemini');

router.post('/compare-loans', async (req, res) => {
  const banks = req.body.banks.map(bank => {
    const amount = parseFloat(bank.amount);
    const rate = parseFloat(bank.interestRate || 10); // default interestRate if not provided
    const tenure = parseInt(bank.tenure);
    const monthlyRate = rate / 12 / 100;
    const emi = calculateEMI(amount, monthlyRate, tenure);
    const total = emi * tenure;
    return { ...bank, emi, total };
  });

  const analysis = await generateAnalysis(banks);
  res.render('loan', { banks, analysis });
});

module.exports = router;