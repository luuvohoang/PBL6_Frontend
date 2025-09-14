
const listHistory = [
    {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    },
    {
        name: "thanh_lam",
        price: 10
    }, {
        name: "thanh_lam",
        price: 10
    },
]
const Data = [
    { id: 8, name: 'Item 8', area: 'CH-A', videoLink: 'https://www.dailymotion.com/embed/video/x8wr5wi?autoplay=1' },
    { id: 2, name: 'Item 2', area: 'CH-B' },
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

var customSelector1 = document.getElementById("customSelect1");
Data.forEach(function (item) {
    var option = document.createElement("option");
    option.value = item.name;
    option.text = item.name;
    customSelector1.appendChild(option);
});
var customSelector2 = document.getElementById("customSelect2");
Data.forEach(function (item) {
    var option = document.createElement("option");
    option.value = item.area;
    option.text = item.area;
    customSelector2.appendChild(option);
})

const html = listHistory.map(item => {
    return `
    <div class="history-list-item">
        <div class="history-list-item-name">
            <p>${item.name}</p>
        </div>
        <div class="history-list-item-price">
            <p>${item.price}</p>
        </div>
    </div>
    `
})

document.querySelector('.history-list').innerHTML = html.join('')
function updateTime() {
    var now = new Date();
    document.getElementById("date").textContent = now.getDate();
    document.getElementById("month").textContent = now.getMonth() + 1;
    document.getElementById("year").textContent = now.getFullYear();
    document.getElementById("hour").textContent = now.getHours();
    document.getElementById("minute").textContent = now.getMinutes();
    document.getElementById("second").textContent = now.getSeconds();
}
setInterval(updateTime, 1000);
window.onload = getLocation;



// Truy cập luồng video từ camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
        var videoElement = document.getElementById('video');
        videoElement.srcObject = stream;
    })
    .catch(function (error) {
        console.log('Lỗi: ' + error);
    });
    
    
