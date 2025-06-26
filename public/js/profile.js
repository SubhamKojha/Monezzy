document.getElementById('alertForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const type = document.getElementById('type').value;
  const limit = parseFloat(document.getElementById('limit').value);

  if (!email || !limit || limit <= 0) return;

  try {
    localStorage.setItem('alertEmail', email);

    const res = await fetch('/api/alerts/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type, limit })
    });

    if (!res.ok) return;

    loadConfiguredAlerts();
    loadAlerts();
  } catch (err) {
    console.error('Set alert error:', err.message);
  }
});

async function loadConfiguredAlerts() {
  const email = document.getElementById('email').value.trim();
  const container = document.getElementById('configuredAlerts');

  if (!email) {
    container.textContent = 'Please enter your email to see alerts.';
    return;
  }

  try {
    const res = await fetch(`/api/alerts/configured/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to load configured alerts');
    const alerts = await res.json();

    while (container.firstChild) container.removeChild(container.firstChild);

    if (alerts.length === 0) {
      container.textContent = 'No alerts set.';
      return;
    }

    const ul = document.createElement('ul');
    alerts.forEach(alert => {
      const li = document.createElement('li');

      const label = document.createElement('strong');
      label.textContent = `${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} – ₹${alert.limit}`;
      li.appendChild(label);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑 Delete';
      deleteBtn.style.marginLeft = '10px';
      deleteBtn.style.color = 'red';

      deleteBtn.addEventListener('click', async () => {
        try {
          const res = await fetch('/api/alerts/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, type: alert.type, limit: alert.limit })
          });

          if (res.ok) {
            li.remove();
            loadAlerts();
          }
        } catch (err) {
          console.error('Delete failed:', err.message);
        }
      });

      li.appendChild(deleteBtn);
      ul.appendChild(li);
    });

    container.appendChild(ul);
  } catch (err) {
    container.textContent = `Error: ${err.message}`;
  }
}

async function loadAlerts() {
  const email = document.getElementById('email').value.trim();
  const container = document.getElementById('alertsContainer');

  while (container.firstChild) container.removeChild(container.firstChild);

  if (!email) {
    container.textContent = 'Please enter your email to check alerts.';
    return;
  }

  try {
    const res = await fetch(`/api/alerts/active/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to load active alerts');
    const alerts = await res.json();

    if (alerts.length === 0) {
      container.textContent = 'No triggered alerts right now.';
      return;
    }

    const table = document.createElement('table');
    table.border = '1';
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Type', 'Limit', 'Spent', '% Used', 'Status'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.background = '#eee';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    alerts.forEach(alert => {
      const tr = document.createElement('tr');
      tr.style.color = alert.level === 'Danger' ? 'red' : 'orange';

      const tdType = document.createElement('td');
      tdType.textContent = alert.type.charAt(0).toUpperCase() + alert.type.slice(1);
      tr.appendChild(tdType);

      const tdLimit = document.createElement('td');
      tdLimit.textContent = `₹${alert.limit}`;
      tr.appendChild(tdLimit);

      const tdSpent = document.createElement('td');
      tdSpent.textContent = `₹${alert.spent}`;
      tr.appendChild(tdSpent);

      const tdPercent = document.createElement('td');
      tdPercent.textContent = `${alert.percentUsed}%`;
      tr.appendChild(tdPercent);

      const tdStatus = document.createElement('td');
      tdStatus.textContent = alert.level === 'Danger' ? '❌ Danger' : '⚠️ Warning';
      tr.appendChild(tdStatus);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

  } catch (err) {
    container.textContent = `Error: ${err.message}`;
  }
}

window.onload = () => {
  const savedEmail = localStorage.getItem('alertEmail');
  if (savedEmail) {
    document.getElementById('email').value = savedEmail;
    loadConfiguredAlerts();
    loadAlerts();
  }
};
