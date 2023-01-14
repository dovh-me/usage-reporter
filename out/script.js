
const ctx = document.getElementById('chart-container');
const xmlHttp = new XMLHttpRequest();
xmlHttp.onload = function () {
    const data = JSON.parse(this.responseText);
    const labels = data.map(e => new Date(e.timestamp).toLocaleTimeString());
    const chartData = data.map(e => +e.used);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Memory Usage',
                data: chartData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
                label: 'Memory Usage (MB)'
            }]
        }
    });
}
xmlHttp.onerror = function () {
    ctx.outerHTML = `"<div id="chart-container" class="chart-container">You need to run the report via a server. <b><a href="https://www.npmjs.com/package/http-server">http-server</a></b> is recommended<div>`
}
xmlHttp.open("GET", "mem-usage.json");
xmlHttp.setRequestHeader("Content-type", "application/json");
xmlHttp.send();
