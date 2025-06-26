const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const ExcelJS = require('exceljs');

router.get('/download', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const incomes = await Income.find({
      date: { $gte: start, $lte: end }
    }).lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Incomes');

    sheet.columns = [
      { header: 'Source', key: 'source', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Recurrence', key: 'recurrence', width: 15 },
      { header: 'Date', key: 'date', width: 20 }
    ];

    incomes.forEach(income => {
      sheet.addRow({
        source: income.source,
        amount: income.amount,
        recurrence: income.recurrence || 'One-time',
        date: new Date(income.date).toLocaleDateString()
      });
    });

    const filename = `incomes_${startDate}_to_${endDate}.xlsx`;

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
