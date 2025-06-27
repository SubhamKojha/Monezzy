// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

// ======== Middleware ========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/generated', express.static('generated'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ======== MongoDB Connection ========
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ======== Cron Jobs ========
require('./services/recurringExpenseCron');
require('./services/recurringIncomeCron');

// ======== Routes ========
// Project 1 Routes
const questionRoutes = require('./routes/questionRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const usersRouter = require('./routes/userRoutes');
const compareRoute = require('./routes/compare');
const formRoutes = require('./routes/formRoutes');

// Project 2 Routes
const expenseRoutes = require('./routes/expenseRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const alertRoutes = require('./routes/alertRoutes');
const download = require('./routes/download');
const incomeDownload = require('./routes/incomeDownload');
const profileRoutes = require('./routes/profileRoutes');
const chatbotRoute = require("./routes/chatbot");

// Register all routes
app.use('/', questionRoutes);
app.use('/', ocrRoutes);
app.use('/', usersRouter);
app.use('/', compareRoute);
app.use('/', formRoutes);
app.use('/expenses', expenseRoutes);
app.use('/savings', savingsRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/income', incomeRoutes);
app.use('/', dashboardRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/expenses', download);
app.use('/api/incomes', incomeDownload);
app.use('/profile', profileRoutes);
app.use("/api/chatbot", chatbotRoute);

// Extra view render
app.get('/compare', (req, res) => {
  res.render('compare');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

