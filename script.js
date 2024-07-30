document.addEventListener('DOMContentLoaded', function() {
    adjustPopupSize();

    const deviceTypes = {
        "Windows 10/11 devices": 0.5,
        "Route Switch and Firewall Devices": 1.0,
        "Wireless Access Points and Controllers": 0.25,
        "Windows Server Instances": 0.5,
        "Hypervisor host instances": 1.0
    };

    const additionalHoursNetNew = 2.0;
    const hourlyRate = 250;

    const deviceInputs = document.getElementById('deviceInputs');
    for (const deviceType in deviceTypes) {
        const label = document.createElement('label');
        label.innerText = `Enter number of ${deviceType}`;
        const input = document.createElement('input');
        input.type = 'number';
        input.id = deviceType.replace(/ /g, '_').replace(/,/g, '').replace(/and/g, 'and');
        input.min = 0;
        input.value = 0;
        deviceInputs.appendChild(label);
        deviceInputs.appendChild(input);
        deviceInputs.appendChild(document.createElement('br'));
    }

    document.getElementById('calculateButton').addEventListener('click', calculateTotalHours);
    document.getElementById('generateCSVButton').addEventListener('click', generateCSV);
    document.getElementById('generateHTMLButton').addEventListener('click', generateHTML);
    document.getElementById('emailReportButton').addEventListener('click', emailReport);
    document.getElementById('openLibraryButton').addEventListener('click', function() {
        window.open('document_library.html', '_blank');
    });

    fetchRSSFeed();
    updateStockPrice();
    setInterval(updateStockPrice, 60000); // Update stock price every minute
});

window.onresize = adjustPopupSize;

function adjustPopupSize() {
    const minWidth = 600;
    const minHeight = 1200;
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    document.body.style.width = `${Math.min(minWidth, maxWidth)}px`;
    document.body.style.height = `${Math.min(minHeight, maxHeight)}px`;
}

function calculateTotalHours() {
    const option1Checked = document.getElementById('option1').checked;
    const option2Checked = document.getElementById('option2').checked;
    const customerName = document.getElementById('customerName').value;
    
    if (!option1Checked && !option2Checked) {
        alert('Please select if customer is Net-new or existing before calculating total...');
        return;
    }
    
    let totalHours = 0;
    const deviceTypes = {
        "Windows 10/11 devices": 0.5,
        "Route Switch and Firewall Devices": 1.0,
        "Wireless Access Points and Controllers": 0.25,
        "Windows Server Instances": 0.5,
        "Hypervisor host instances": 1.0
    };
    for (const deviceType in deviceTypes) {
        const count = parseInt(document.getElementById(deviceType.replace(/ /g, '_').replace(/,/g, '').replace(/and/g, 'and')).value, 10);
        if (count > 0) {
            totalHours += count * deviceTypes[deviceType];
        }
    }
    if (option1Checked) {
        totalHours += additionalHoursNetNew;
    }
    const totalPrice = totalHours * hourlyRate;
    document.getElementById('totalHours').innerText = `Total Hours: ${totalHours}`;
    document.getElementById('totalPrice').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
}

function generateCSV() {
    const customerName = document.getElementById('customerName').value;
    let csvContent = `data:text/csv;charset=utf-8,Customer Name,${customerName}\nDevice Type,Count\n`;
    const deviceTypes = {
        "Windows 10/11 devices": 0.5,
        "Route Switch and Firewall Devices": 1.0,
        "Wireless Access Points and Controllers": 0.25,
        "Windows Server Instances": 0.5,
        "Hypervisor host instances": 1.0
    };
    for (const deviceType in deviceTypes) {
        const count = document.getElementById(deviceType.replace(/ /g, '_').replace(/,/g, '').replace(/and/g, 'and')).value;
        csvContent += `${deviceType},${count}\n`;
    }
    csvContent += `Total Hours,${document.getElementById('totalHours').innerText.split(' ')[2]}\n`;
    csvContent += `Total Price,${document.getElementById('totalPrice').innerText.split(' ')[2]}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.getElementById('downloadLink');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'onboardinglabor.csv');
    link.style.display = 'block';
    link.click();
}

function generateHTML() {
    const customerName = document.getElementById('customerName').value;
    let htmlContent = `<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Onboarding Report</title></head><body><h1>Onboarding Report</h1><h2>Customer: ${customerName}</h2><ul>`;
    const deviceTypes = {
        "Windows 10/11 devices": 0.5,
        "Route Switch and Firewall Devices": 1.0,
        "Wireless Access Points and Controllers": 0.25,
        "Windows Server Instances": 0.5,
        "Hypervisor host instances": 1.0
    };
    for (const deviceType in deviceTypes) {
        const count = document.getElementById(deviceType.replace(/ /g, '_').replace(/,/g, '').replace(/and/g, 'and')).value;
        htmlContent += `<li>${deviceType}: ${count}</li>`;
    }
    htmlContent += `</ul><p>Total Hours: ${document.getElementById('totalHours').innerText.split(' ')[2]}</p>`;
    htmlContent += `<p>Total Price: ${document.getElementById('totalPrice').innerText.split(' ')[2]}</p></body></html>`;

    const encodedUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    const link = document.getElementById('downloadLink');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'onboardinglabor.html');
    link.style.display = 'block';
    link.click();
}

function emailReport() {
    const customerName = document.getElementById('customerName').value;
    const totalHours = document.getElementById('totalHours').innerText.split(' ')[2];
    const totalPrice = document.getElementById('totalPrice').innerText.split(' ')[2];
    const subject = `Onboarding Report for ${customerName}`;
    const body = `Customer: ${customerName}\nTotal Hours: ${totalHours}\nTotal Price: ${totalPrice}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

function fetchRSSFeed() {
    const rssUrl = 'https://www.calian.com/rss-feed';
    fetch(rssUrl)
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

function updateStockPrice() {
    // Mock stock price update
    const stockPrice = (Math.random() * 100).toFixed(2); // Random price for demo purposes
    document.getElementById('stockPrice').innerText = `$${stockPrice}`;
}
