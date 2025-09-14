function toggleNotificationList() {
    const notificationList = document.querySelector('.notification .notification-list');
    notificationList.style.display = notificationList.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function (event) {
    const notification = document.querySelector('.notification');
    const isClickInside = notification.contains(event.target);

    if (!isClickInside) {
        document.querySelector('.notification .notification-list').style.display = 'none';
    }
});

function updateDateTime() {
    const now = new Date();
    document.getElementById('date').textContent = now.getDate().toString().padStart(2, '0');
    document.getElementById('month').textContent = (now.getMonth() + 1).toString().padStart(2, '0');
    document.getElementById('year').textContent = now.getFullYear();
    document.getElementById('hour').textContent = now.getHours().toString().padStart(2, '0');
    document.getElementById('minute').textContent = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('second').textContent = now.getSeconds().toString().padStart(2, '0');
}


function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            document.getElementById('location').textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
        }, error => {
            document.getElementById('location').textContent = 'Unable to retrieve location.';
        });
    } else {
        document.getElementById('location').textContent = 'Geolocation is not supported by this browser.';
    }
}
