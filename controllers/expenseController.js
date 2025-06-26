const Expense = require('../models/Expense');
const RecurringExpense = require('../models/recurringExpense');

// GET /expenses (render EJS page)
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ date: { $lte: new Date() } }).sort({ date: -1 });
    const recurringExpenses = await RecurringExpense.find().sort({ startDate: 1 });

    const dailyChartData = await Expense.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyChartData = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.render('index', {
      expenses,
      recurringExpenses,
      dailyChartData,
      monthlyChartData
    });
  } catch (err) {
    console.error('[EXPENSE CONTROLLER ERROR]:', err);
    res.status(500).send('Error loading expenses');
  }
};

// POST /expenses
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const isRecurring = req.body.isRecurring === 'on';
    const recurringMonths = parseInt(req.body.recurringMonths || '0');

    if (isRecurring && recurringMonths > 0) {
      await RecurringExpense.create({
        title,
        amount,
        category,
        startDate: new Date(date),
        duration: recurringMonths,
      });
    } else {
      await Expense.create({
        title,
        amount,
        category,
        date: new Date(date),
        isRecurring: false,
        isPending: new Date(date) > new Date()
      });
    }

    res.redirect('/expenses');
  } catch (error) {
    console.error('[ADD EXPENSE ERROR]', error);
    res.status(400).send('Failed to add expense');
  }
};

// POST /expenses/delete/:id
const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.redirect('/expenses');
  } catch (error) {
    console.error('[DELETE EXPENSE ERROR]', error);
    res.status(500).send('Failed to delete expense');
  }
};

// POST /expenses/recurring/delete/:id
const deleteRecurringRule = async (req, res) => {
  try {
    await RecurringExpense.findByIdAndDelete(req.params.id);
    res.redirect('/expenses');
  } catch (err) {
    console.error('[DELETE RECURRING RULE ERROR]', err);
    res.status(500).send('Failed to delete recurring rule');
  }
};

module.exports = {
  getAllExpenses,
  addExpense,
  deleteExpense,
  deleteRecurringRule
};
