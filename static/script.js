
function fetchDate() {
    fetch('/api/latest')
        .then(response => response.json())
        .then(data => {
            document.getElementById('tensiune').innerText = data.tensiune + " V";
            document.getElementById('temperatura').innerText = data.temperatura + " °C";
            document.getElementById('timestamp').innerText = data.timestamp;

           
            const voltageText = data.tensiune;
            const voltage = parseFloat(voltageText);
            
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


fetchDate();
setInterval(fetchDate, 2000);
