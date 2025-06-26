// Assumes chartData, totalIncome, totalExpense, totalSavings are defined via EJS in dashboard.ejs

const labels = chartData.map(d => d.month);
const incomes = chartData.map(d => d.income);
const expenses = chartData.map(d => d.expense);
const savings = chartData.map(d => d.savings);

// Combined Bar Chart
new Chart(document.getElementById('combinedChart'), {
  type: 'bar',
  data: {
    labels,
    datasets: [
      { label: 'Income', data: incomes, backgroundColor: '#00ff99' },
      { label: 'Expense', data: expenses, backgroundColor: '#ff3366' },
      { label: 'Savings', data: savings, backgroundColor: '#3399ff' }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Monthly Income vs Expense vs Savings', color: '#fff' },
      legend: { labels: { color: '#fff' } }
    },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' }, beginAtZero: true }
    }
  }
});

// Pie Chart
new Chart(document.getElementById('financialPie'), {
  type: 'doughnut',
  data: {
    labels: ['Income', 'Expense', 'Savings'],
    datasets: [{
      data: [totalIncome, totalExpense, totalSavings],
      backgroundColor: ['#00ff99', '#ff3366', '#3399ff']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#fff' } },
      title: { display: true, text: 'Total Income vs Expense vs Savings', color: '#fff' }
    }
  }
});

// Progress Bar Animation
document.querySelectorAll(".progress-bar").forEach(bar => {
  const percent = bar.getAttribute("data-percent");
  bar.style.width = percent + "%";
});


document.addEventListener('DOMContentLoaded', () => {
  const rangeDropdown = document.getElementById('topExpenseRange');
  const tableBody = document.getElementById('topExpensesTableBody');

  const loadExpenses = async (months) => {
    // Show loading row
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: #9ca3af;">Loading...</td>
      </tr>
    `;

    try {
      const res = await fetch(`/api/top-expenses?months=${months}`);
      const data = await res.json();

      // Clear table
      tableBody.innerHTML = '';

      if (!data.length) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center; color: #9ca3af;">No expenses found for this range.</td>
          </tr>
        `;
        return;
      }

      // Populate rows
      data.forEach((e, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${String(i + 1).padStart(2, '0')}</td>
          <td>${e.title}</td>
          <td>${new Date(e.date).toLocaleDateString('en-GB')}</td>
          <td>₹${e.amount.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
      });

    } catch (err) {
      console.error('Fetch error:', err);
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: #ef4444;">Error loading expenses.</td>
        </tr>
      `;
    }
  };

  // Initial load
  loadExpenses(rangeDropdown.value);

  // On dropdown change
  rangeDropdown.addEventListener('change', () => {
    loadExpenses(rangeDropdown.value);
  });
});

