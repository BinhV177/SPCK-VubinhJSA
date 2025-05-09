
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý các nút lọc
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Xóa class active từ tất cả các nút
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Thêm class active cho nút được click
                this.classList.add('active');
                
                // Lọc sản phẩm theo danh mục
                const category = this.getAttribute('data-category');
                if (category === 'all') {
                    filterProductsByCategory('Tất cả');
                } else {
                    filterProductsByCategory(category);
                }
            });
        });
    }
    
    // Xử lý bộ lọc sắp xếp
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            const sortType = this.value;
            sortProducts(sortType);
        });
    }
    
    // Xử lý nút thêm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll('.product-overlay button[title="Thêm vào giỏ hàng"]');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Thêm sản phẩm vào giỏ hàng (giả định có hàm addToCart)
            if (typeof addToCart === 'function') {
                addToCart(productId, productTitle, productPrice, productImage, 1);
                showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            }
        });
    });
    
    // Xử lý nút xem nhanh
    const quickViewButtons = document.querySelectorAll('.product-overlay button[title="Xem nhanh"]');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Hiển thị modal xem nhanh (giả định có hàm showQuickViewModal)
            if (typeof showQuickViewModal === 'function') {
                showQuickViewModal(productId, productTitle, productPrice, productImage);
            }
        });
    });
});

// Cập nhật hàm lọc sản phẩm để hoạt động với cả 3 trang
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    if (category === 'Tất cả') {
        // Hiển thị tất cả sản phẩm
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // Lọc sản phẩm theo danh mục
        productCards.forEach(card => {
            const productCategory = card.getAttribute('data-category');
            if (productCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Hàm lọc sản phẩm theo bộ sưu tập
function filterProductsByCollection(collection) {
    // Thực hiện lọc sản phẩm theo bộ sưu tập
    // Đây là mã giả, bạn cần thay thế bằng logic thực tế
    console.log(`Lọc sản phẩm theo bộ sưu tập: ${collection}`);
    
    // Ví dụ: Hiển thị thông báo bộ sưu tập
    const categorySection = document.querySelector('.category-section');
    const collectionTitle = document.createElement('div');
    collectionTitle.className = 'collection-title';
    
    let collectionName = '';
    switch(collection) {
        case 'office':
            collectionName = 'Thời Trang Công Sở';
            break;
        case 'casual':
            collectionName = 'Thời Trang Dạo Phố';
            break;
        case 'formal':
            collectionName = 'Thời Trang Dự Tiệc';
            break;
        default:
            collectionName = 'Bộ Sưu Tập';
    }
    
    collectionTitle.innerHTML = `<h3>Bộ Sưu Tập: ${collectionName}</h3>`;
    categorySection.insertBefore(collectionTitle, document.querySelector('.filter-container'));
}

// Hàm sắp xếp sản phẩm
function sortProducts(sortType) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const products = Array.from(productGrid.querySelectorAll('.product-card'));
    
    switch(sortType) {
        case 'newest':
            // Giả sử sản phẩm mới nhất đã được sắp xếp theo thứ tự mặc định
            products.sort((a, b) => 0); // Giữ nguyên thứ tự
            break;
        case 'price-asc':
            products.sort((a, b) => {
                const priceA = parseInt(a.getAttribute('data-price'));
                const priceB = parseInt(b.getAttribute('data-price'));
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            products.sort((a, b) => {
                const priceA = parseInt(a.getAttribute('data-price'));
                const priceB = parseInt(b.getAttribute('data-price'));
                return priceB - priceA;
            });
            break;
        case 'bestseller':
            // Giả sử có thuộc tính data-bestseller
            products.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector('.product-rating span').textContent.replace(/[()]/g, '')) || 0;
                const ratingB = parseFloat(b.querySelector('.product-rating span').textContent.replace(/[()]/g, '')) || 0;
                return ratingB - ratingA;
            });
            break;
    }
    
    // Xóa tất cả sản phẩm hiện tại
    products.forEach(product => product.remove());
    
    // Thêm lại sản phẩm theo thứ tự mới
    products.forEach(product => {
        productGrid.appendChild(product);
    });
}

// Hàm xử lý mobile menu
function setupMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburgerMenu && mobileMenu) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        
        // Xử lý submenu trên mobile
        const hasSubmenuItems = document.querySelectorAll('.mobile-nav-links .has-submenu');
        
        hasSubmenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' || e.target.tagName === 'I') {
                    e.preventDefault();
                    this.classList.toggle('active');
                }
            });
        });
    }
}





