const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/', expenseController.getAllExpenses);
router.post('/', expenseController.addExpense);
router.post('/delete/:id', expenseController.deleteExpense);
router.post('/recurring/delete/:id', expenseController.deleteRecurringRule);

module.exports = router;
