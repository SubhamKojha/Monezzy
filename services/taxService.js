function calculateOldRegimeTax(data) {
    const { grossSalary, stdDeduction = 50000, sec80C = 0, sec80D = 0, hra = 0, profTax = 0 } = data;
    let taxableIncome = grossSalary - stdDeduction - sec80C - sec80D - hra - profTax;
    if (taxableIncome <= 250000) return 0;
    else if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) return 12500 + (taxableIncome - 500000) * 0.2;
    else return 112500 + (taxableIncome - 1000000) * 0.3;
}

function calculateNewRegimeTax(data) {
    const { grossSalary } = data;
    let taxableIncome = grossSalary;
    if (taxableIncome <= 250000) return 0;
    else if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 750000) return 12500 + (taxableIncome - 500000) * 0.1;
    else if (taxableIncome <= 1000000) return 37500 + (taxableIncome - 750000) * 0.15;
    else if (taxableIncome <= 1250000) return 75000 + (taxableIncome - 1000000) * 0.2;
    else if (taxableIncome <= 1500000) return 125000 + (taxableIncome - 1250000) * 0.25;
    else return 187500 + (taxableIncome - 1500000) * 0.3;
}

function compareRegimes(data) {
    const oldTax = calculateOldRegimeTax(data);
    const newTax = calculateNewRegimeTax(data);
    const diff = oldTax - newTax;
    let message = diff > 0
        ? `You save ₹${diff.toFixed(2)} under the New Regime.`
        : diff < 0
            ? `You save ₹${Math.abs(diff).toFixed(2)} under the Old Regime.`
            : `Both regimes result in the same tax.`;

    return {
        oldTax: oldTax.toFixed(2),
        newTax: newTax.toFixed(2),
        message
    };
}

module.exports = { compareRegimes };
