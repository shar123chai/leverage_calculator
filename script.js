document.getElementById('calculator-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const entryPrice = parseFloat(document.getElementById('entry-price').value);
    const exitPrice = parseFloat(document.getElementById('exit-price').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const targetProfitPercent = parseFloat(document.getElementById('target-profit').value);
    const stopLoss = parseFloat(document.getElementById('stop-loss').value);
    const takeProfit = parseFloat(document.getElementById('take-profit').value);

    if (entryPrice <= 0 || exitPrice <= 0 || amount <= 0 || targetProfitPercent <= 0) {
        alert("Please enter valid positive numbers for all fields.");
        return;
    }

    const priceDifference = exitPrice - entryPrice;
    const percentageIncrease = (priceDifference / entryPrice) * 100;
    const requiredLeverage = targetProfitPercent / percentageIncrease;

    const resultText = `
        <div>Entry Price: ${entryPrice.toFixed(8)}</div>
        <div>Exit Price: ${exitPrice.toFixed(8)}</div>
        <div>Amount: ${amount.toFixed(8)}</div>
        <div>Target Profit (%): ${targetProfitPercent.toFixed(8)}</div>
        <div>Price Difference: ${priceDifference.toFixed(8)}</div>
        <div>Percentage Increase: ${percentageIncrease.toFixed(8)}%</div>
        <div>Required Leverage: ${requiredLeverage.toFixed(2)}x</div>
    `;

    const pnlText = `
        <div>Stop-Loss Price: ${stopLoss.toFixed(8)}</div>
        <div>Take-Profit Price: ${takeProfit.toFixed(8)}</div>
        <div>Potential Loss: ${((entryPrice - stopLoss) * amount).toFixed(8)}</div>
        <div>Potential Profit: ${((takeProfit - entryPrice) * amount).toFixed(8)}</div>
    `;

    document.getElementById('current-calculation').innerHTML = resultText;
    document.getElementById('pnl-calculation').innerHTML = pnlText;

    saveCalculation(resultText + pnlText);
    updateQueryList();
    animateResult();
});

document.getElementById('mode-selector').addEventListener('change', function() {
    document.body.className = this.value;
});

function saveCalculation(resultText) {
    const previousCalculations = JSON.parse(localStorage.getItem('calculations')) || [];
    previousCalculations.push(resultText);
    localStorage.setItem('calculations', JSON.stringify(previousCalculations));
}

function updateQueryList() {
    const previousCalculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const queryList = document.getElementById('query-list');
    queryList.innerHTML = previousCalculations.map((calculation, index) => `<li onclick="showCalculation(${index})">Query ${index + 1}</li>`).join('');
}

function showCalculation(index) {
    const previousCalculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const calculation = previousCalculations[index];
    const resultText = calculation.split('<div>Stop-Loss Price:')[0];
    const pnlText = '<div>Stop-Loss Price:' + calculation.split('<div>Stop-Loss Price:')[1];
    
    document.getElementById('current-calculation').innerHTML = resultText;
    document.getElementById('pnl-calculation').innerHTML = pnlText;
}

function animateResult() {
    const rightPanel = document.querySelector('.right-panel');
    rightPanel.classList.remove('show');
    void rightPanel.offsetWidth; // Trigger reflow to restart the animation
    rightPanel.classList.add('show');
}

// Initialize query list on page load
updateQueryList();
