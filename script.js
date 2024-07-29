document.addEventListener('DOMContentLoaded', function() {
    adjustPopupSize();

    const deviceTypes = {
        "Windows 10/11 devices": 0.5,
        "Route Switch and Firewall Devices": 1.0,
        "Wireless Access Points and Controllers": 0.25, // New item with 0.25 hours per device
        "Windows Server Instances": 0.5, // Corrected label
        "Hypervisor host instances": 1.0
    };

    const additionalHoursNetNew = 2.0;

    const deviceInputs = document.getElementById('deviceInputs');
    for (const deviceType in deviceTypes) {
        const label = document.createElement('label');
        label.innerText = `Enter number of ${deviceType}`;
        const input = document.createElement('input');
        input.type = 'number';
        input.id = deviceType.replace(/ /g, '_').replace(/,/g, '').replace(/and/g, 'and'); // Use underscores instead of spaces in IDs
        input.min = 0;
        input.value = 0;
        deviceInputs.appendChild(label);
        deviceInputs.appendChild(input);
        deviceInputs.appendChild(document.createElement('br'));
    }

    document.getElementById('calculateButton').addEventListener('click', calculateTotalHours);
    document.getElementById('generateCSVButton').addEventListener('click', generateCSV);
    document.getElementById('generateHTMLButton').addEventListener('click', generateHTML);
});

window.onresize = adjustPopupSize;

function adjustPopupSize() {
    const minWidth = 600; // Set the minimum width to 600px
    const minHeight = 1200; // Set the minimum height to 1200px
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    document.body.style.width = `${Math.min(minWidth, maxWidth)}px`;
    document.body.style.height = `${Math.min(minHeight, maxHeight)}px`;
}

function calculateTotalHours() {
    const option1Checked = document.getElementById('option1').checked;
    const option2Checked = document.getElementById('option2').checked;
    
    if (!option1Checked && !option2Checked) {
        alert('Please select if customer is Net-new or existing before calculating total...');
        return;
    }
    
    let totalHours = 0;
    const deviceTypes = {
        "Windows 10/11 devices": 0.5,
        "Route Switch and Firewall Devices": 1.0,
        "Wireless Access Points and Controllers": 0.25, // New item with 0.25 hours per device
        "Windows Server Instances": 0.5, // Corrected label
        "Hypervisor host instances": 1.0
    };
    for (const deviceType in deviceTypes) {
        const count = parseInt(document.getElementById(deviceType.replace(/ /g, '_').replace(/,/g, '').replace(/and/g, 'and')).value, 10);
        if (count > 0) {
            totalHours += count * deviceTypes[deviceType];
        }
    }
    totalHours += 2.0; // additionalHoursNetNew
    document.getElementById('totalHours').innerText = `Total Hours: ${totalHours}`;
}

function generateCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,Device Type,Count\n';
    const deviceTypes = {
        "Windows 10/11 devices": 0.5,
        "Route Switch and Firewall Devices": 1.0,
        "Wireless Access Points and Controllers": 0.25, // New item with 0.25 hours per device
        "Windows Server Instances": 0.5, // Corrected label
        "Hypervisor host instances": 1.0
    };
    for (const deviceType in deviceTypes) {
        const count = document.getElementById(deviceType.replace(/ /g, '_').replace(/,/g, '').replace(/and/g, 'and')).value;
        csvContent += `${deviceType},${count}\n`;
    }
    csvContent += `Total Hours,${document.getElementById('totalHours').innerText.split(' ')[2]}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.getElementById('downloadLink');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'onboardinglabor.csv');
    link.style.display = 'block';
    link.click();
}

function generateHTML() {
    let htmlContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Onboarding Report</title></head><body><h1>Onboarding Report</h1><ul>';
    const deviceTypes = {
        "Windows 10/11 devices": 0.5, // 30 minute per/device weight
        "Route Switch and Firewall Devices": 1.0, // 1 hour per/device weight
        "Wireless Access Points and Controllers": 0.25, // 15 minute per/device weight
        "Windows Server Instances": 0.5, // 30 minute per/device weight
        "Hypervisor host instances": 1.0 // 1 hour per/device weight
    };
    for (const deviceType in deviceTypes) {
        const count = document.getElementById(deviceType.replace(/ /g, '_').replace(/,/g, '').replace(/and/g, 'and')).value;
        htmlContent += `<li>${deviceType}: ${count}</li>`;
    }
    htmlContent += `</ul><p>Total Hours: ${document.getElementById('totalHours').innerText.split(' ')[2]}</p></body></html>`;

    const encodedUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    const link = document.getElementById('downloadLink');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'onboardinglabor.html');
    link.style.display = 'block';
    link.click();
}
