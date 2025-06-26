function handleRecurrenceChange() {
  const recur = document.getElementById("recurrence").value;
  document.getElementById("customIntervalDays").style.display = recur === "Custom" ? "block" : "none";
}

// Optional: If you're keeping the form async
document.getElementById('incomeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const source = document.getElementById('source').value;
  const recurrence = document.getElementById('recurrence').value;
  const customIntervalDays = document.getElementById('customIntervalDays').value || null;

  await fetch('/api/incomes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount, date, category, source, recurrence, customIntervalDays })
  });

  // Just reload the page to get updated list from server
  window.location.reload();
});

function renderIncomeChart(data) {
  if (!data || !data.length) return;

  const monthlyTotals = {};
  let earliest = new Date(data[0].date);
  let latest = new Date(data[0].date);

  data.forEach(income => {
    const d = new Date(income.date);
    if (d < earliest) earliest = d;
    if (d > latest) latest = d;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyTotals[key] = (monthlyTotals[key] || 0) + income.amount;
  });

  const labels = [];
  const current = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const end = new Date(latest.getFullYear(), latest.getMonth(), 1);

  while (current <= end) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    labels.push(key);
    if (!monthlyTotals[key]) monthlyTotals[key] = 0;
    current.setMonth(current.getMonth() + 1);
  }

  const totals = labels.map(key => monthlyTotals[key]);

  const canvas = document.getElementById('incomeChart');
  if (window.incomeChartInstance) window.incomeChartInstance.destroy();

  const ctx = canvas.getContext('2d');
  window.incomeChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Income',
        data: totals,
        backgroundColor: 'rgba(0,128,0,0.6)',
        borderColor: 'green',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function downloadIncome() {
  const start = document.getElementById('incomeStartDate').value;
  const end = document.getElementById('incomeEndDate').value;

  if (!start || !end) {
    alert('Please select both start and end dates');
    return;
  }

  const url = `/api/incomes/download?startDate=${start}&endDate=${end}`;
  window.location.href = url;
}

window.onload = () => {
  // chartData is injected via EJS
  renderIncomeChart(chartData);
};

document.getElementById('downloadBtn').addEventListener('click', () => {
  const start = document.getElementById('incomeStartDate').value;
  const end = document.getElementById('incomeEndDate').value;

  if (!start || !end) {
    alert('Please select both start and end dates');
    return;
  }

  const url = `/api/incomes/download?startDate=${start}&endDate=${end}`;
  window.location.href = url;
});