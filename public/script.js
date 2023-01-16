
const ctx = document.getElementById('chart');
const xmlHttp = new XMLHttpRequest();
xmlHttp.onload = function () {
    const data = JSON.parse(this.responseText);
    const labels = data.dataset.map(e => new Date(e.timestamp).toLocaleTimeString());
    const chartData = data.dataset.map(e => +e.used);

    setSummaryFields(data);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Memory Usage',
                data: chartData,
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0,
                label: 'Memory Usage (MB)'
            }]
        },
        options: {
            elements: {
                point: {
                    pointStyle:false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                decimation: {
                    enabled: true,
                    threshold: 1000
                }
            },
            scales: {
                x: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time',
                        }
                    },
                y: {
                        display: true,
                        max: (Math.round(data.dataset[0].total) *100)/100
                    }
            },
        },
    });
}

function setSummaryFields({startTimestamp, endTimestamp, hostname, dataset}) {
    console.log('Setting summary fields');
    const averageMemoryField = document.getElementsByClassName('avg-mem');
    const hostnameField = document.getElementsByClassName('host-name');
    const timeDurationField = document.getElementsByClassName('duration');

    // calculate the average memory usage
    const avgMem = Math.round((dataset.reduce(((prev, curr) => prev += +curr.used), 0) / dataset.length) *100)/100;
    averageMemoryField.item(0).textContent = `${avgMem} MB`;

    hostnameField.item(0).textContent = hostname.trim();
    timeDurationField.item(0).textContent = `${new Date(startTimestamp).toLocaleString()} - ${new Date(endTimestamp).toLocaleString()}`
}

xmlHttp.onerror = function () {
    document.getElementById('chart-container').innerHTML = `"<div style="display:center;align-items:center;">You need to run the report via a server. <b><a href="https://www.npmjs.com/package/http-server">http-server</a></b> is recommended<div>`
}

xmlHttp.open("GET", "mem-usage.json");
xmlHttp.setRequestHeader("Content-type", "application/json");
xmlHttp.send();
