document.addEventListener('DOMContentLoaded', function() {
    const deviceTypes = {
        "Windows_10_11_devices": 0.5,
        "Route_Switch_and_Firewall_Devices": 1.0,
        "Wireless_Access_Points_and_Controllers": 0.25,
        "Windows_Server_Instances": 0.5,
        "Hypervisor_host_instances": 1.0
    };

    const deviceInputs = document.getElementById('deviceInputs');
    for (const deviceType in deviceTypes) {
        const label = document.createElement('label');
        label.innerText = `Enter number of ${deviceType.replace(/_/g, ' ')}`;
        const input = document.createElement('input');
        input.type = 'number';
        input.id = deviceType;
        input.min = 0;
        input.value = 0;
        deviceInputs.appendChild(label);
        deviceInputs.appendChild(input);
        deviceInputs.appendChild(document.createElement('br'));
    }

    document.getElementById('calculateButton').addEventListener('click', calculateTotalHours);

    function calculateTotalHours() {
        let totalHours = 0;
        const options = document.querySelectorAll('input[type="number"]');
        options.forEach(option => {
            if (option.value > 0) {
                const deviceType = option.id;
                const count = parseFloat(option.value);
                totalHours += count * deviceTypes[deviceType];
            }
        });
        document.getElementById('totalHours').innerText = `Total Hours: ${totalHours.toFixed(2)}`;
        document.getElementById('totalPrice').innerText = `Total Price: $${(totalHours * 100).toFixed(2)}`;
    }

    fetchRSSFeed();

    function fetchRSSFeed() {
        const rssUrl = 'https://www.calian.com/rss-feed';
        return fetch(rssUrl)
            .then(response => response.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                const items = data.querySelectorAll("item");
                let html = `<h2>RSS Feed</h2><ul>`;
                items.forEach(el => {
                    html += `<li><a href="${el.querySelector("link").textContent}" target="_blank">${el.querySelector("title").textContent}</a></li>`;
                });
                html += `</ul>`;
                document.getElementById('rssFeed').innerHTML = html;
            });
    }

    document.getElementById('generateCSVButton').addEventListener('click', generateCSV);
    document.getElementById('generateHTMLButton').addEventListener('click', generateHTML);
    document.getElementById('emailReportButton').addEventListener('click', emailReport);
    document.getElementById('generatePDFButton').addEventListener('click', generatePDF);

    function generateCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Device Type,Hours,Formula\n";
        
        const options = document.querySelectorAll('input[type="number"]');
        options.forEach(option => {
            if (option.value > 0) {
                const deviceType = option.id.replace(/_/g, ' ');
                const count = parseFloat(option.value);
                const hours = count * deviceTypes[option.id];
                csvContent += `${deviceType},${hours},Number of ${deviceType} * ${deviceTypes[option.id]}\n`;
            }
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generateHTML() {
        let htmlContent = "<html><body>";
        htmlContent += "<h1>Device Report</h1>";
        htmlContent += "<table border='1'><tr><th>Device Type</th><th>Hours</th><th>Formula</th></tr>";
        
        const options = document.querySelectorAll('input[type="number"]');
        options.forEach(option => {
            if (option.value > 0) {
                const deviceType = option.id.replace(/_/g, ' ');
                const count = parseFloat(option.value);
                const hours = count * deviceTypes[option.id];
                htmlContent += `<tr><td>${deviceType}</td><td>${hours}</td><td>Number of ${deviceType} * ${deviceTypes[option.id]}</td></tr>`;
            }
        });
        
        htmlContent += "</table></body></html>";
        
        const blob = new Blob([htmlContent], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "report.html";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function emailReport() {
        alert("Email Report functionality requires a backend service to send emails.");
    }

    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Device Report", 10, 10);
        let y = 20;

        doc.autoTable({
            startY: y,
            head: [['Device Type', 'Hours', 'Formula']],
            body: getTableData(),
        });

        doc.save('report.pdf');
    }

    function getTableData() {
        const tableData = [];
        const options = document.querySelectorAll('input[type="number"]');
        options.forEach(option => {
            if (option.value > 0) {
                const deviceType = option.id.replace(/_/g, ' ');
                const count = parseFloat(option.value);
                const hours = count * deviceTypes[option.id];
                tableData.push([deviceType, hours.toFixed(2), `Number of ${deviceType} * ${deviceTypes[option.id]}`]);
            }
        });
        return tableData;
    }
});
