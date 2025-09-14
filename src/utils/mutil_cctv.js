fetch('./header.jsp')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
            })
            .catch(error => console.error('Error fetching header:', error));



        
                function showPage(pageName) {
                    let DATA=[];
                    const contentElement = document.querySelector('.content');
                    switch (pageName) {
                        case 'cctv-view-all':
                            contentElement.innerHTML = `
                            <div class="cctv-view-all-content">
                                <div class="title-content">
                                    <h2>CCTV View All</h2>
                                </div>
                                <div class="cctv-view">
                                    <div class="container cctv-view-content"></div>
                                    <div class="pagination">
                                        <a href="#" class="page-link previous">&lt;&lt;</a>
                                        <span class="page-number">1</span>
                                        <a href="#" class="page-link next">&gt;&gt;</a>
                                    </div>
                                </div>
                            </div>
                        `;
                            DATA=cameraproject;
                            renderPage(DATA,'.cctv-view-content', '.previous', '.next', '.page-number');
                            break;
                        case 'site-A':
                            contentElement.innerHTML = `
                                <div class="cctv-view-all-content">
                                    <div class="title-content">
                                        <h2>SITE-A</h2>
                                    </div>
                                    <div class="cctv-view">
                                        <div class="container cctv-view-content"></div>
                                        <div class="pagination">
                                            <a href="#" class="page-link previous">&lt;&lt;</a>
                                            <span class="page-number">1</span>
                                            <a href="#" class="page-link next">&gt;&gt;</a>
                                        </div>
                                    </div>
                                </div>
                            `;
                            DATA=data.filter(item=>item.id===1);
                            renderPage(DATA,'.cctv-view-content', '.previous', '.next', '.page-number');
                            break;
                        case 'site-B':
                            contentElement.innerHTML = `
                                <div class="cctv-view-all-content">
                                    <div class="title-content">
                                        <h2>SITE-B</h2>
                                    </div>
                                    <div class="cctv-view">
                                        <div class="container cctv-view-content"></div>
                                        <div class="pagination">
                                            <a href="#" class="page-link previous">&lt;&lt;</a>
                                            <span class="page-number">1</span>
                                            <a href="#" class="page-link next">&gt;&gt;</a>
                                        </div>
                                    </div>
                                </div>
                            `;
                            DATA=data.filter(item=>item.id===2);
                            renderPage(DATA,'.cctv-view-content', '.previous', '.next', '.page-number');
                            break;
                        case 'underground-vertical-zone':
                            contentElement.innerHTML = `
                                <div class="cctv-view-all-content">
                                    <div class="title-content">
                                        <h2>UNDERGROUND VERTICAL ZONE</h2>
                                    </div>
                                    <div class="cctv-view">
                                        <div class="container cctv-view-content"></div>
                                        <div class="pagination">
                                            <a href="#" class="page-link previous">&lt;&lt;</a>
                                            <span class="page-number">1</span>
                                            <a href="#" class="page-link next">&gt;&gt;</a>
                                        </div>
                                    </div>
                                </div>
                            `;
                            DATA=data.filter(item=>item.id===3);
                            renderPage(DATA,'.cctv-view-content', '.previous', '.next', '.page-number');
                            break;
                        case'show-bookmark':
                                contentElement.innerHTML = `
                                <div class="cctv-view-all-content">
                                    <div class="title-content">
                                        <h2>SHOW BOOKMARK</h2>
                                    </div>
                                    <div class="cctv-view">
                                        <div class="container show-bookmark"></div>
                                        <div class="pagination">
                                            <a href="#" class="page-link previous">&lt;&lt;</a>
                                            <span class="page-number">1</span>
                                            <a href="#" class="page-link next">&gt;&gt;</a>
                                        </div>
                                    </div>
                                </div>
                            `;
                            DATA=bookmarkedItems
                            renderPage(DATA,'.show-bookmark', '.previous', '.next', '.page-number');
                            break;
                        default:
                            break;
                        
                    }
                    
                }
                let bookmarkedItems = [];
        
                function toggleBookmark(button) {
                    // Lấy thông tin của mục từ phần tử HTML
                    const itemId = parseInt(button.parentElement.parentElement.querySelector('.element-area').textContent);
                    const itemName = button.parentElement.parentElement.querySelector('.element-name-cctv').textContent;
                    
                    const isBookmarked = bookmarkedItems.some(item => item.id === itemId && item.name === itemName); // Kiểm tra xem mục đã được đánh dấu bookmark chưa
                    if (isBookmarked) {
                        bookmarkedItems = bookmarkedItems.filter(item => !(item.id === itemId && item.name === itemName)); // Loại bỏ mục khỏi danh sách bookmarkedItems
                        button.classList.remove('bookmarked'); // Xóa class 'bookmarked' để gỡ bỏ hiển thị icon bookmark
                    } else {
                        const selectedItem = data.find(item => item.id === itemId && item.name === itemName);
                        bookmarkedItems.push(selectedItem); // Thêm mục vào danh sách bookmarkedItems
                        button.classList.add('bookmarked'); // Thêm class 'bookmarked' để hiển thị icon bookmark
                    }
                    renderData(bookmarkedItems, '.show-bookmark');
                }
                
                document.querySelectorAll('.element-bookmark button').forEach(button => {
                    button.addEventListener('click', function() {
                        toggleBookmark(this);
                    });
                });
                
                
                function createItemRenderer(item) {
                    const itemRenderer = document.createElement('div');
                    itemRenderer.classList.add('item');
                    itemRenderer.innerHTML = `
                        <div class="item-view-cctv">
                            <iframe class="video-cctv" frameborder="0" type="text/html" src="${item.videoLink}" width="100%" height="100%" allowfullscreen title="Dailymotion Video Player" allow="autoplay"></iframe>
        
                        </div>
                        <div class="item-information">
                            <div class="element-type">
                                <div class="element-icon"></div>
                                <div class="element-area"> ${item.id}</div>
                                <div class="element-name-cctv">${item.name}</div>
                                <div class="element-status-cctv"></div>
                                <div class="element-bookmark">
                                    <button onclick="toggleBookmark(this)"><i class="fas fa-bell"></i></button>
                                </div>
                            </div>
                            <div class="element-notifications">
                                <button class="button-notifications"> No Unidentified Notifications</button>
                            </div>
                        </div>
                    `;
        
                    return itemRenderer;
                }
        
        
                function renderData(data, containerSelector) {
                    const container = document.querySelector(containerSelector);
                    container.innerHTML = '';
                    data.forEach(item => {
                        const itemRenderer = createItemRenderer(item);
                        container.appendChild(itemRenderer);
                    });
                }
                function updatePageNumber(pageNumberSelector, currentPage) {
                    document.querySelector(pageNumberSelector).textContent = currentPage;
                }
        
                function renderPage(data,containerSelector, previousButtonSelector, nextButtonSelector, pageNumberSelector) {
                    let currentPage = 1;
                    const itemsPerPage = 8;
                    const previousButton = document.querySelector(previousButtonSelector);
                    const nextButton = document.querySelector(nextButtonSelector);
        
                    function render() {
                        const start = (currentPage - 1) * itemsPerPage;
                        const end = start + itemsPerPage;
                        const dataToShow = data.slice(start, end);
                        renderData(dataToShow, containerSelector);
                        updatePageNumber(pageNumberSelector, currentPage);
                    }
        
                    previousButton.addEventListener('click', function (event) {
                        if (currentPage > 1) {
                            currentPage--;
                            render();
                        }
                        event.preventDefault();
                    });
        
                    nextButton.addEventListener('click', function (event) {
                        const totalPages = Math.ceil(data.length / itemsPerPage);
                        if (currentPage < totalPages) {
                            currentPage++;
                            render();
                        }
                        event.preventDefault();
                    });
        
                    render();
                }
        
                // Hiển thị trang mặc định
        
        
                var prevClicked = null;
                function toggleClicked(element) {
                    if (prevClicked !== null && prevClicked !== element) {
                        prevClicked.classList.remove('clicked');
                    }
                    element.classList.toggle('clicked');
                    prevClicked = element;
                }
        

        