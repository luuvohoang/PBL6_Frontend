const canvases = document.querySelectorAll('.myChart-1, .myChart-2, .myChart-3');
canvases.forEach(canvas =>{
    new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: '',
                data: [12, 19, 3, 5, 2, 3,6],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(128, 128, 128, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(128, 128, 128)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false 
                }
            }
        }
    });
})


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



fetch('./header.jsp')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
            })
            .catch(error => console.error('Error fetching header:', error));

