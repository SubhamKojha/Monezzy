window.onload = function () {
  let oldTaxStr = '<%= result.oldTax || 0 %>';
  let newTaxStr = '<%= result.newTax || 0 %>';

  // Remove commas just in case
  const oldTax = parseFloat(oldTaxStr.replace(/,/g, '')) || 0;
  const newTax = parseFloat(newTaxStr.replace(/,/g, '')) || 0;

  console.log("Old Tax:", oldTax, "New Tax:", newTax); // REMOVE THIS in production

  const adviceBox = document.getElementById("regimeAdviceBox");

  if (Math.abs(oldTax - newTax) < 1) {
    adviceBox.innerHTML = `
      <div class="better-regime neutral">
        <h3>🤝 Both Regimes Yield the Same Tax</h3>
        <p>Looks like your tax liability is identical in both regimes. Choose the one that feels easier to file or maintain in future.</p>
      </div>
    `;
  } else if (oldTax < newTax) {
    adviceBox.innerHTML = `
      <div class="better-regime old">
        <h3>✔️ Old Regime is Better for You</h3>
        <p>You’re saving more tax under the old regime, thanks to your smart investments and deductions. Keep it up!</p>
        <p><strong>Tip:</strong> If you regularly invest in tax-saving instruments and pay rent, the old regime usually works best.</p>
      </div>
    `;
  } else {
    adviceBox.innerHTML = `
      <div class="better-regime new">
        <h3>✔️ New Regime is Better for You</h3>
        <p>You’ll pay less tax under the simplified new regime. Ideal if you don’t want to deal with paperwork or deductions.</p>
        <p><strong>Tip:</strong> If you don’t claim many deductions or just want simplicity, new regime is the way to go.</p>
      </div>
    `;
  }
};
