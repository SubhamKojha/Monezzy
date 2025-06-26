const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// Add new income (keep as API)
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, source, recurrence, customIntervalDays } = req.body;
    const income = new Income({
      title,
      amount,
      category,
      date,
      source,
      recurrence,
      customIntervalDays,
      active: true
    });
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔄 Render income.ejs with chart + full income list
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;

    const filter = {};
    if (month && year) {
      const start = new Date(`${year}-${parseInt(month) + 1}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    } else if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${parseInt(year) + 1}-01-01`);
      filter.date = { $gte: start, $lt: end };
    }

    const incomes = await Income.find(filter).sort({ date: -1 });

    const chartData = incomes.map(entry => ({
      date: new Date(entry.date).toISOString(),
      amount: entry.amount
    }));

    const totalIncome = incomes.reduce((sum, entry) => sum + entry.amount, 0);


      // Calculate monthly average
      let monthlyAverageIncome = 0;
      if (incomes.length > 0) {
        // Find min and max dates
        const sorted = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
        const start = new Date(sorted[0].date);
        const end = new Date(sorted[sorted.length - 1].date);

        const monthDiff =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth()) + 1;

        monthlyAverageIncome = totalIncome / monthDiff;
      }

    // Get all years for dropdown
    const yearsRaw = await Income.find().distinct('date');
    const years = [...new Set(yearsRaw.map(d => new Date(d).getFullYear()))].sort();

    res.render('income', {
      incomes,
      chartData,
      totalIncome,
      monthlyAverageIncome,
      selectedMonth: month || '',
      selectedYear: year || '',
      years
    });
  } catch (err) {
    console.error('Income render error:', err);
    res.status(500).send('Error loading income page');
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.redirect('/income'); // or preserve query string later
  } catch (err) {
    console.error('Delete income error:', err);
    res.status(500).send('Failed to delete income');
  }
});

module.exports = router;
