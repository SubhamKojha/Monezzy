const Savings = require('../models/Savings');
const Expense = require('../models/Expense'); 

// GET all savings and render EJS view
exports.getSavings = async (req, res) => {
  try {
    const sort = req.query.sort || 'closest';
    const all = await Savings.find();

    let sortedSavings = all;
    if (sort === 'latest') {
      sortedSavings = all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'oldest') {
      sortedSavings = all.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // closest to complete
      sortedSavings = all.sort((a, b) =>
        (a.target - (a.saved || 0)) - (b.target - (b.saved || 0))
      );
    }

    res.render('savings', { savings: sortedSavings, sort });
  } catch (err) {
    console.error('Savings Fetch Error:', err);
    res.status(500).send('Failed to fetch savings goals');
  }
};

// POST create new savings goal
exports.addSavings = async (req, res) => {
  const { name, target, deadline } = req.body;

  try {
    const savings = new Savings({
      name,
      target,
      saved: 0,
      deadline: deadline ? new Date(deadline) : null,
    });

    await savings.save();
    res.redirect('/savings');
  } catch (err) {
    console.error('Create Savings Error:', err);
    res.status(400).send('Failed to create savings goal');
  }
};

// ✅ POST add amount to savings goal + add expense
exports.addToSavings = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const savings = await Savings.findById(id);
    if (!savings) return res.status(404).send('Savings goal not found');

    const numericAmount = Number(amount);
    if (numericAmount <= 0) return res.status(400).send('Amount must be positive');

    // Update saved amount
    savings.saved += numericAmount;
    await savings.save();

    // Add to Expense (matching your schema)
    const expense = new Expense({
      title: `Transfer to savings: ${savings.name}`,
      amount: numericAmount,
      category: 'Savings',
      date: new Date(),
      isPending: false
    });

    await expense.save();

    res.redirect('/savings');
  } catch (err) {
    console.error('Add to Savings Error:', err);
    res.status(400).send('Failed to update savings goal');
  }
};

// POST delete savings goal
exports.deleteSavings = async (req, res) => {
  const { id } = req.params;

  try {
    await Savings.findByIdAndDelete(id);
    res.redirect('/savings');
  } catch (err) {
    console.error('Delete Savings Error:', err);
    res.status(500).send('Failed to delete savings goal');
  }
};
