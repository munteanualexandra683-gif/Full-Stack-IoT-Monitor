let telemetryChart;

function initChart() {
    const ctx = document.getElementById('telemetryChart').getContext('2d');
    
    Chart.defaults.color = '#86868b';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    
    telemetryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Voltage (V)',
                    data: [],
                    borderColor: '#34c759',
                    backgroundColor: 'rgba(52, 199, 89, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 10,
                },
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: '#f5a623',
                    backgroundColor: 'rgba(245, 166, 35, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 10,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#1d1d1f',
                    bodyColor: '#1d1d1f',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    usePointStyle: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 6,
                        maxRotation: 0,
                        callback: function(value, index, values) {
                            const label = this.getLabelForValue(value);
                            if (label) {
                                const parts = label.split(' ');
                                return parts.length > 1 ? parts[1] : label;
                            }
                            return label;
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Voltage (V)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    },
                    grid: {
                        drawOnChartArea: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

function fetchDate() {
    fetch('/api/latest')
        .then(response => response.json())
        .then(data => {
            document.getElementById('tensiune').innerText = data.tensiune + " V";
            document.getElementById('temperatura').innerText = data.temperatura + " °C";
            const localDate = new Date(data.timestamp + 'Z');
            document.getElementById('timestamp').innerText = localDate.toLocaleString('ro-RO');

            const voltage = parseFloat(data.tensiune);
            const voltageValueEl = document.getElementById('tensiune');
            const voltageIndicatorEl = document.getElementById('voltage-indicator');

            voltageValueEl.className = 'value';
            voltageIndicatorEl.className = 'indicator';

            if (!isNaN(voltage)) {
                if (voltage < 12.0) {
                    voltageValueEl.classList.add('danger');
                    voltageIndicatorEl.classList.add('danger');
                } else if (voltage < 13.5) {
                    voltageValueEl.classList.add('warning');
                    voltageIndicatorEl.classList.add('warning');
                } else {
                    voltageValueEl.classList.add('safe');
                    voltageIndicatorEl.classList.add('safe');
                }
            }
        })
        .catch(error => console.error('Eroare:', error));
}

function fetchHistory() {
    fetch('/api/history')
        .then(response => response.json())
        .then(data => {
            if (!telemetryChart) return;
            
            const labels = data.map(item => {
                const localDate = new Date(item.timestamp + 'Z');
                return localDate.toLocaleTimeString('ro-RO');
            });
            const voltages = data.map(item => item.tensiune);
            const temps = data.map(item => item.temperatura);
            
            telemetryChart.data.labels = labels;
            telemetryChart.data.datasets[0].data = voltages;
            telemetryChart.data.datasets[1].data = temps;
            
            telemetryChart.update('none');
        })
        .catch(error => console.error('Eroare istoric:', error));
}

initChart();
fetchDate();
fetchHistory();

setInterval(() => {
    fetchDate();
    fetchHistory();
}, 2000);
