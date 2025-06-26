const Budget = require('../models/Alert');
const Expense = require('../models/Expense');

exports.getBudgetAlerts = async (req, res) => {
  const userId = req.params.userId;
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const budgets = await Budget.find({ userId });
  const alerts = [];

  for (const budget of budgets) {
    const expenses = await Expense.find({
      userId,
      category: budget.category,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const percentUsed = Math.round((spent / budget.monthlyLimit) * 100);

    if (percentUsed >= 80) {
      alerts.push({
        category: budget.category,
        limit: budget.monthlyLimit,
        spent,
        percentUsed,
        level: percentUsed >= 100 ? 'Exceeded' : 'Warning'
      });
    }
  }

  res.json(alerts);
};
