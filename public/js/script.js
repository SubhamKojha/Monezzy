let expenseChartInstance = null;
let monthlyChartInstance = null;

// Toggle recurring months input based on checkbox
document.getElementById("isRecurring").addEventListener("change", function () {
  document.getElementById("recurringMonthsInput").style.display = this.checked ? 'inline' : 'none';
});

// Draw daily expense chart
function renderDailyChart() {
  const data = Array.isArray(window.dailyChartData) ? window.dailyChartData : [];
  const labels = data.map(d => {
    const dt = new Date(d._id + 'T00:00:00');
    return `${String(dt.getDate()).padStart(2, '0')}-${String(dt.getMonth() + 1).padStart(2, '0')}-${dt.getFullYear()}`;
  });
  const values = data.map(d => d.total);

  if (expenseChartInstance) expenseChartInstance.destroy();

  expenseChartInstance = new Chart(document.getElementById('expenseChart').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Daily Expenses',
        data: values,
        borderColor: 'blue',
        backgroundColor: 'transparent',
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Draw monthly expense chart
function renderMonthlyChart() {
  const data = Array.isArray(window.monthlyChartData) ? window.monthlyChartData : [];
  const labels = data.map(d => {
    const month = String(d._id.month).padStart(2, '0');
    return `${month}-${d._id.year}`;
  });
  const values = data.map(d => d.total);

  if (monthlyChartInstance) monthlyChartInstance.destroy();

  monthlyChartInstance = new Chart(document.getElementById('monthlyChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Expenses',
        data: values,
        backgroundColor: 'orange'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Load charts on page load
window.addEventListener("DOMContentLoaded", () => {
  renderDailyChart();
  renderMonthlyChart();
});

// Excel download button handler
document.getElementById("downloadBtn").addEventListener("click", () => {
  const start = document.getElementById("downloadStart").value;
  const end = document.getElementById("downloadEnd").value;

  if (!start || !end) {
    alert("Please select both start and end dates!");
    return;
  }

  const url = `/api/expenses/download?startDate=${start}&endDate=${end}`;
  window.open(url, "_blank");
});
