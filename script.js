document.addEventListener('DOMContentLoaded', function() {
    const deviceTypes = {
        "Windows_10_11_devices": 0.5,
        "Route_Switch_and_Firewall_Devices": 1.0,
        "Wireless_Access_Points_and_Controllers": 0.25,
        "Windows_Server_Instances": 0.5,
        "Hypervisor_host_instances": 1.0
    };

    const additionalHoursNetNew = 2.0;
    const hourlyRate = 250;

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
    document.getElementById('generateCSVButton').addEventListener('click', generateCSV);
    document.getElementById('generateHTMLButton').addEventListener('click', generateHTML);
    document.getElementById('emailReportButton').addEventListener('click', emailReport);
    document.getElementById('toggleSidebarButton').addEventListener('click', toggleSidebar);
    document.getElementById('closeSidebarButton').addEventListener('click', toggleSidebar);

    fetchRSSFeed();
    adjustPopupSize();
    window.onresize = adjustPopupSize;
});

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
    const customerName = document.getElementById('customerName').value.trim();

    if (!option1Checked && !option2Checked) {
        alert('Please select if the customer is Net-new or existing before calculating total...');
        return;
    }

    if (customerName === "") {
        alert('Please enter a customer name before calculating total...');
        return;
    }

    const deviceTypes = {
        "Windows_10_11_devices": 0.5,
        "Route_Switch_and_Firewall_Devices": 1.0,
        "Wireless_Access_Points_and_Controllers": 0.25,
        "Windows_Server_Instances": 0.5,
        "Hypervisor_host_instances": 1.0
    };
    
    let totalHours = 0;
    for (const deviceType in deviceTypes) {
        const count = parseInt(document.getElementById(deviceType).value, 10);
        if (!isNaN(count) && count > 0) {
            totalHours += count * deviceTypes[deviceType];
            if (option1Checked) {
                totalHours += additionalHoursNetNew; // Adds 2 additional hours for each input with a value above 0 for Net-New customers
            }
        }
    }

    const totalPrice = totalHours * hourlyRate;
    document.getElementById('totalHours').innerText = `Total Hours: ${totalHours.toFixed(2)}`;
    document.getElementById('totalPrice').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
}

function generateCSV() {
    const customerName = document.getElementById('customerName').value.trim();
    let csvContent = `data:text/csv;charset=utf-8,Customer Name,${customerName}\nDevice Type,Count\n`;
    const deviceTypes = {
        "Windows_10_11_devices": 0.5,
        "Route_Switch_and_Firewall_Devices": 1.0,
        "Wireless_Access_Points_and_Controllers": 0.25,
        "Windows_Server_Instances": 0.5,
        "Hypervisor_host_instances": 1.0
    };
    for (const deviceType in deviceTypes) {
        const count = document.getElementById(deviceType).value;
        csvContent += `${deviceType.replace(/_/g, ' ')},${count}\n`;
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
    const customerName = document.getElementById('customerName').value.trim();
    let htmlContent = `<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Onboarding Report</title></head><body><h1>Onboarding Report</h1><h2>Customer: ${customerName}</h2><ul>`;
    const deviceTypes = {
        "Windows_10_11_devices": 0.5,
        "Route_Switch_and_Firewall_Devices": 1.0,
        "Wireless_Access_Points_and_Controllers": 0.25,
        "Windows_Server_Instances": 0.5,
        "Hypervisor_host_instances": 1.0
    };
    for (const deviceType in deviceTypes) {
        const count = document.getElementById(deviceType).value;
        htmlContent += `<li>${deviceType.replace(/_/g, ' ')}: ${count}</li>`;
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
    const customerName = document.getElementById('customerName').value.trim();
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

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}
