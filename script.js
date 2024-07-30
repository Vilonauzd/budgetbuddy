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
            })
    }
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}
