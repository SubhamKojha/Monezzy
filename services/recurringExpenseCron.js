const mongoose = require("mongoose");
const cron = require("node-cron");
const Expense = require("../models/Expense");
const RecurringExpense = require("../models/recurringExpense");
require("dotenv").config();

// Connect to DB (if this is run independently)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("[DB] MongoDB connected (from cron)"))
    .catch(err => console.error("[DB ERROR]", err));
}

async function processRecurringExpenses() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const rules = await RecurringExpense.find();

    for (let rule of rules) {
      const { title, amount, category, startDate, duration, _id: ruleId } = rule;

      for (let i = 0; i < duration; i++) {
        const due = new Date(startDate);
        due.setMonth(due.getMonth() + i);
        due.setHours(0, 0, 0, 0);

        if (due > today) continue;

        const exists = await Expense.findOne({ ruleId, date: due });

        if (!exists) {
          await Expense.create({
            title,
            amount,
            category,
            date: due,
            isRecurring: true,
            isPending: due > new Date(),
            ruleId
          });

          console.log(`[CRON] ✅ Inserted: ${title} for ${due.toDateString()}`);
        } else {
          console.log(`[CRON] ⏭️ Already exists: ${title} on ${due.toDateString()}`);
        }
      }
    }
  } catch (err) {
    console.error("[CRON ERROR]:", err);
  }
}

// Schedule: Every minute (dev) — use '1 0 * * *' for production (daily at 12:01AM)
cron.schedule("* * * * *", processRecurringExpenses);

// Run once at startup
processRecurringExpenses();

module.exports = processRecurringExpenses;
