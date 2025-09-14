document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('my-chart').getContext('2d');
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
        datasets: [
            {
                label: 'Brown',
                data: [3, 6, 2, 3, 2, 1, 5, 6],
                backgroundColor: 'rgba(165, 42, 42, 0.2)',
                borderColor: 'rgb(165, 42, 42)',
                borderWidth: 1
            },
            {
                label: 'Gray',
                data: [4, 8, 1, 4, 3, 1, 6, 8],
                backgroundColor: 'rgba(128, 128, 128, 0.2)',
                borderColor: 'rgb(128, 128, 128)',
                borderWidth: 1
            },
            {
                label: 'Orange',
                data: [6, 12, 2, 6, 5, 1, 8, 10],
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgb(255, 159, 64)',
                borderWidth: 1
            },
            {
                label: 'Purple',
                data: [9, 16, 4, 7, 3, 2, 9, 14],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgb(153, 102, 255)',
                borderWidth: 1
            },
            {
                label: 'Green',
                data: [5, 10, 3, 8, 4, 2, 10, 12],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            },
            {
                label: 'Yellow',
                data: [8, 14, 5, 10, 6, 4, 15, 18],
                backgroundColor: 'rgba(255, 205, 86, 0.2)',
                borderColor: 'rgb(255, 205, 86)',
                borderWidth: 1
            },
            {
                label: 'Blue',
                data: [10, 15, 7, 12, 8, 5, 13, 20],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            },
            {
                label: 'Red',
                data: [12, 19, 3, 5, 2, 3, 10, 15],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            }
        ]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Stacked Column Chart with Annotations'
                }
            }
        }
    });
});

const Data = [
    { id: 8, name: 'Item 8', videoLink: 'https://www.dailymotion.com/embed/video/x8wr5wi?autoplay=1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3', videoLink: 'https://www.dailymotion.com/embed/video/x8wr5wi?autoplay=1' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
];

var customSelector = document.getElementById("customSelect");
Data.forEach(function (item) {
    var option = document.createElement("option");
    option.value = item.id;
    option.text = item.name;
    customSelector.appendChild(option);
});

function search() {
    var fromDate = new Date(document.getElementById("from").value);
    var toDate = new Date(document.getElementById("to").value);

    if (fromDate > toDate) {
        alert("End date must be greater than start date");
        return;
    }

    // Thực hiện tìm kiếm dựa trên fromDate và toDate
    // Viết mã tìm kiếm ở đây4
    // cho nay bao xu ly hay sao day

}

// Khởi tạo datepicker cho input "From" và "To"
document.addEventListener("DOMContentLoaded", function () {
    var fromDate, toDate;
    document.getElementById("from").addEventListener("click", function () {
        showDatePicker("from");
    });
    document.getElementById("to").addEventListener("click", function () {
        showDatePicker("to");
    });

    function showDatePicker(id) {
        var datePickerConfig = {
            dateFormat: "dd/mm/yy",
            onSelect: function (dateText) {
                if (id === "from") {
                    fromDate = new Date(dateText);
                    document.getElementById("from").value = dateText;
                } else if (id === "to") {
                    toDate = new Date(dateText);
                    if (fromDate && toDate && fromDate > toDate) {
                        alert("End date must be greater than start date");
                        document.getElementById("to").value = ""; // Clear the input
                    } else {
                        document.getElementById("to").value = dateText;
                    }
                }
            }
        };
        $(`#${id}`).datepicker(datePickerConfig).datepicker("show");
    }
});
function search() {
    var fromDate = document.getElementById("from").value;
    var toDate = document.getElementById("to").value;
    var selectedOnsite = document.getElementById("customSelect").value;

    if (!selectedOnsite) {
        alert("Please select an onsite.");
        return;
    }

    if (!fromDate || !toDate) {
        alert("Please select both start and end dates.");
        return;
    }

    var formattedFromDate = formatDate(fromDate);
    var formattedToDate = formatDate(toDate);

    var historyText = `Search: "${selectedOnsite}" CH& Period - ${formattedFromDate} to ${formattedToDate}`;
    document.querySelector('.all-detection-history span').textContent = historyText;
}

function formatDate(dateString) {
    var [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}


fetch('./header.jsp')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
            })
            .catch(error => console.error('Error fetching header:', error));