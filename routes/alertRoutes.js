const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Expense = require('../models/Expense');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Set or update an alert
router.post('/set', async (req, res) => {
  const { email, type, limit } = req.body;

  try {
    const existing = await Alert.findOne({ email, type });

    if (existing) {
      existing.limit = limit;
      await existing.save();
      return res.json({ message: 'Alert updated' });
    }

    await Alert.create({ email, type, limit });
    res.status(201).json({ message: 'Alert set successfully' });
  } catch (err) {
    console.error('Error setting alert:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get active alerts and send emails if limit is crossed
router.get('/active/:email', async (req, res) => {
  const email = req.params.email;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  try {
    const alerts = await Alert.find({  }); // have to add email later
    const triggered = [];

    for (const alert of alerts) {
      let expenses = [];

      if (alert.type === 'daily') {
        expenses = await Expense.find({
          date: { $gte: startOfDay, $lte: endOfDay }
        });
      } else if (alert.type === 'monthly') {
        expenses = await Expense.find({
          date: { $gte: monthStart, $lte: monthEnd }
        });
      }

      const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
      const percentUsed = ((totalSpent / alert.limit) * 100).toFixed(2); // preserve decimal

        if (totalSpent >= alert.limit) {
          const level = 'Danger';

          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: alert.email,
            subject: `${level} Alert: ${alert.type.toUpperCase()} Spending`,
            text: `You've reached your ₹${alert.limit} ${alert.type} spending limit!\n\nTotal spent: ₹${totalSpent} (${percentUsed}%).`
          }, (error, info) => {
            if (error) console.error('Email failed:', error);
          });

          triggered.push({
            type: alert.type,
            limit: alert.limit,
            spent: totalSpent,
            percentUsed,
            level
          });

        } else if (percentUsed >= 70) {
          const level = 'Warning';

          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: alert.email,
            subject: `${level} Alert: ${alert.type.toUpperCase()} Spending`,
            text: `Your ${alert.type} spending has reached ${percentUsed}% of your ₹${alert.limit} limit.\n\nTotal spent: ₹${totalSpent}.`
          }, (error, info) => {
            if (error) console.error('Email failed:', error);
          });

          triggered.push({
            type: alert.type,
            limit: alert.limit,
            spent: totalSpent,
            percentUsed,
            level
          });

      }
    }

    res.json(triggered);
  } catch (err) {
    console.error('Error checking alerts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all configured alerts for a user
router.get('/configured/:email', async (req, res) => {
  try {
    const alerts = await Alert.find({ email: req.params.email });
    res.json(alerts);
  } catch (err) {
    console.error('Error fetching configured alerts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/delete', async (req, res) => {
  const { type, limit } = req.body;
  const email = req.user?.email || req.body.email;

  try {
    await Alert.deleteOne({ email, type, limit });
    res.redirect('/profile'); // or wherever this page lives
  } catch (err) {
    console.error('[ALERT DELETE ERROR]', err);
    res.status(500).send('Failed to delete alert');
  }
});

module.exports = router;
