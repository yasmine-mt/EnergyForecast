// Example: Fetch and display data
document.addEventListener('DOMContentLoaded', () => {
    // Fetch key metrics
    fetch('/api/metrics')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalConsumption').textContent = data.totalConsumption;
            document.getElementById('avgConsumption').textContent = data.avgConsumption;
            document.getElementById('peakConsumption').textContent = data.peakConsumption;
        });

    // Fetch model performance
    fetch('/api/performance')
        .then(response => response.json())
        .then(data => {
            document.getElementById('lstmRMSE').textContent = data.lstm.rmse;
            document.getElementById('lstmMAE').textContent = data.lstm.mae;
            document.getElementById('lstmR2').textContent = data.lstm.r2;

            document.getElementById('cnnLstmRMSE').textContent = data.cnnLstm.rmse;
            document.getElementById('cnnLstmMAE').textContent = data.cnnLstm.mae;
            document.getElementById('cnnLstmR2').textContent = data.cnnLstm.r2;

             document.getElementById('gruRMSE').textContent = data.gru.rmse;
            document.getElementById('gruMAE').textContent = data.gru.mae;
            document.getElementById('gruR2').textContent = data.gru.r2;

             document.getElementById('rfRMSE').textContent = data.rf.rmse;
            document.getElementById('rfMAE').textContent = data.rf.mae;
            document.getElementById('rfR2').textContent = data.rf.r2;

             document.getElementById('sarimaRMSE').textContent = data.sarima.rmse;
            document.getElementById('sarimaMAE').textContent = data.sarima.mae;
            document.getElementById('sarimaR2').textContent = data.sarima.r2;
        });



    // Fetch and render charts
    fetch('/api/consumption-trends')
        .then(response => response.json())
        .then(data => {
            const lineChartData = {
                x: data.dates,
                y: data.values,
                type: 'line',
                name: 'Energy Consumption'
            };
            Plotly.newPlot('lineChart', [lineChartData], { title: 'Daily Energy Consumption' });

            const barChartData = {
                x: data.dates,
                y: data.values,
                type: 'bar',
                name: 'Energy Consumption'
            };
            Plotly.newPlot('barChart', [barChartData], { title: 'Daily Energy Consumption' });
        });
});
document.getElementById('forecastForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Predicting...';

    try {
        const response = await fetch('/forecast', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            const tableBody = document.querySelector('#predictionTable tbody');
            tableBody.innerHTML = ''; // Clear previous results

            data.forEach(prediction => {
                const row = `<tr><td>${prediction.time}</td><td>${prediction.consumption.toFixed(2)}</td></tr>`;
                tableBody.innerHTML += row;
            });

            // Generate chart
            const chartData = {
                x: data.map(p => p.time),
                y: data.map(p => p.consumption),
                type: 'scatter',
                mode: 'lines',
                name: 'Predicted Consumption'
            };
            Plotly.newPlot('predictionChart', [chartData], { title: 'Energy Consumption Forecast' });

            document.getElementById('results').classList.remove('hidden');
        }
    } catch (error) {
        alert('Server error. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Predict';
    }
});
