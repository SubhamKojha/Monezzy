const cron = require('node-cron');
const Income = require('../models/Income');

// Run daily at 12:02 AM
cron.schedule('2 0 * * *', async () => {
  const today = new Date();
  const recurringIncomes = await Income.find({ recurrence: { $ne: 'One-time' }, active: true });

  for (const income of recurringIncomes) {
    const startDate = new Date(income.date);
    if (startDate > today) continue;

    let occurrences = [];

    if (income.recurrence === 'Weekly') {
      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 7)) {
        occurrences.push(new Date(d));
      }
    } else if (income.recurrence === 'Monthly') {
      for (
        let d = new Date(startDate);
        d <= today;
        d.setMonth(d.getMonth() + 1)
      ) {
        occurrences.push(new Date(d));
      }
    } else if (income.recurrence === 'Custom' && income.customIntervalDays) {
      const interval = parseInt(income.customIntervalDays, 10);
      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + interval)) {
        occurrences.push(new Date(d));
      }
    }

    for (const occDate of occurrences) {
      // Strip time to avoid duplicate-day issues
      const startOfDay = new Date(occDate.getFullYear(), occDate.getMonth(), occDate.getDate());
      const endOfDay = new Date(occDate.getFullYear(), occDate.getMonth(), occDate.getDate() + 1);

      const exists = await Income.findOne({
        title: income.title,
        amount: income.amount,
        date: { $gte: startOfDay, $lt: endOfDay },
        source: income.source,
        recurrence: income.recurrence
      });

      if (!exists) {
        await Income.create({
          title: income.title,
          amount: income.amount,
          date: new Date(startOfDay), // Clean date
          source: income.source,
          category: income.category,
          recurrence: income.recurrence,
          customIntervalDays: income.customIntervalDays,
          active: true,
        });

        console.log('Auto-added recurring income:', income.title, startOfDay.toDateString());
      }
    }
  }
});
