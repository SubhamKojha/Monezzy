const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Savings = require('../models/Savings');

// Utility: Last 6 months for dashboard chart
function getLastSixMonths() {
  const months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      key: `${d.getFullYear()}-${d.getMonth()}`
    });
  }
  return months;
}

// 📊 Route: Dashboard page
router.get('/dashboard', async (req, res) => {
  try {
    const range = parseInt(req.query.range || '1'); // optional for SSR dropdown
    const rangeStart = new Date();
    rangeStart.setMonth(rangeStart.getMonth() - range);

    const months = getLastSixMonths();
    const [incomeData, expenseData, savingsData] = await Promise.all([
      Income.find({}),
      Expense.find({ isPending: false }),
      Savings.find({})
    ]);

    const incomeByMonth = {};
    const expenseByMonth = {};

    months.forEach(m => {
      incomeByMonth[m.key] = 0;
      expenseByMonth[m.key] = 0;
    });

    incomeData.forEach(income => {
      const date = new Date(income.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (incomeByMonth[key] !== undefined) {
        incomeByMonth[key] += income.amount;
      }
    });

    expenseData.forEach(expense => {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (expenseByMonth[key] !== undefined) {
        expenseByMonth[key] += expense.amount;
      }
    });

    const chartData = months.map(m => ({
      month: `${m.month} ${m.year}`,
      income: incomeByMonth[m.key],
      expense: expenseByMonth[m.key],
      savings: incomeByMonth[m.key] - expenseByMonth[m.key],
    }));

    const totalIncome = incomeData.reduce((acc, cur) => acc + cur.amount, 0);
    const totalExpense = expenseData.reduce((acc, cur) => acc + cur.amount, 0);

    const topExpenses = expenseData
      .filter(e => e.date >= rangeStart)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(e => ({
        title: e.title,
        amount: e.amount,
        date: e.date
      }));

    const topSavings = savingsData
      .filter(s => s.name && s.target && s.saved !== undefined)
      .map(s => {
        const current = Number(s.saved) || 0;
        const target = Number(s.target) || 0;
        const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;

        return {
          item: s.name,
          target,
          current,
          percent
        };
      })
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);

    res.render('dashboard', {
      totalIncome,
      totalExpense,
      totalSavings: totalIncome - totalExpense,
      chartData,
      topExpenses,
      topSavings,
      range
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🧠 API: Top 5 Expenses by Date Range (used by dropdown)
router.get('/api/top-expenses', async (req, res) => {
  try {
    const months = parseInt(req.query.months || '1');
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const topExpenses = await Expense.find({
      date: { $gte: startDate },
      isPending: false
    })
      .sort({ amount: -1 })
      .limit(5);

    const result = topExpenses.map(e => ({
      title: e.title,
      amount: e.amount,
      date: e.date
    }));

    res.json(result);
  } catch (err) {
    console.error('Top expense fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch top expenses' });
  }
});

module.exports = router;
