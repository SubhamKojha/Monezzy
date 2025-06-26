const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const ExcelJS = require('exceljs');

router.get('/download', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    // Normalize date range
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Start of day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of day

    const expenses = await Expense.find({
      date: { $gte: start, $lte: end }
    }).lean();

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Expenses');

    // Define columns
    sheet.columns = [
      { header: 'Title', key: 'title', width: 20 },
      { header: 'Amount', key: 'amount', width: 10 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
    ];

    // Add rows
    expenses.forEach(exp => {
      sheet.addRow({
        title: exp.title,
        amount: exp.amount,
        category: exp.category,
        date: new Date(exp.date).toLocaleDateString()
      });
    });

    // Dynamic file name
    const filename = `expenses_${startDate}_to_${endDate}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating Excel file');
  }
});

module.exports = router;
