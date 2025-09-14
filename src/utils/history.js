fetch('./header.jsp')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
            })
            .catch(error => console.error('Error fetching header:', error));
                const Data = [
                    { id: 8, name: 'Item 8', area: 'CH-A', videoLink: 'https://www.dailymotion.com/embed/video/x8wr5wi?autoplay=1' },
                    { id: 2, name: 'Item 2', area: 'CH-B' },
                    { id: 3, name: 'Item 3', videoLink: 'https://www.dailymotion.com/embed/video/x8wr5wi?autoplay=1' },
                ];
    
                var customSelector1 = document.getElementById("customSelect1");
                Data.forEach(function (item) {
                    var option = document.createElement("option");
                    option.value = item.id;
                    option.text = item.name;
                    customSelector1.appendChild(option);
                });
                var customSelector2 = document.getElementById("customSelect2");
                Data.forEach(function (item) {
                    var option = document.createElement("option");
                    option.value = item.id;
                    option.text = item.area;
                    customSelector2.appendChild(option);
                })
    
                function Search() {
                    var fromDate = document.getElementById("from").value;
                    var toDate = document.getElementById("to").value;
                    var selectedOnsite = document.getElementById("customSelect1").value; // Sửa đổi ở đây
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
                    document.querySelector('.item-title .span-nd').textContent = historyText;
                }
                
                function formatDate(dateString) {
                    var [day, month, year] = dateString.split('/');
                    return `${year}-${month}-${day}`;
                }
                
    
                function search() {
                    var fromDate = new Date(document.getElementById("from").value);
                    var toDate = new Date(document.getElementById("to").value);
    
                    if (fromDate > toDate) {
                        alert("End date must be greater than start date");
                        return;
                    }
    
                    // Thực hiện tìm kiếm dựa trên fromDate và toDate
                    // Viết mã tìm kiếm ở đây
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
                                        document.getElementById("to").value = "";
                                    } else {
                                        document.getElementById("to").value = dateText;
                                    }
                                }
                            }
                        };
                        $(`#${id}`).datepicker(datePickerConfig).datepicker("show");
                    }
                });
                
                
                

