
document.addEventListener('DOMContentLoaded', function() {
    // Import các hàm từ cart-manager.js
    import('./cart-manager.js').then(module => {
        const { addToCart, updateCartCount, showNotification } = module;
        
        // Xử lý nút thêm vào giỏ hàng
        document.querySelectorAll('.product-overlay button[title="Thêm vào giỏ hàng"], .cart-icon-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-id');
                const productTitle = productCard.querySelector('.product-title').textContent;
                const productPrice = parseFloat(productCard.getAttribute('data-price') || 
                                              productCard.querySelector('.current-price').textContent.replace(/[^\d]/g, ''));
                const productImage = productCard.querySelector('.product-image img').src;
                
                // Thêm sản phẩm vào giỏ hàng
                addToCart({
                    id: productId,
                    name: productTitle,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
                
                // Hiển thị thông báo
                showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
                
                // Cập nhật số lượng hiển thị
                updateCartCount();
            });
        });
        
        // Xử lý bộ lọc sắp xếp
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                const sortType = this.value;
                sortProducts(sortType);
            });
        }
        
        // Xử lý nút lọc danh mục
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Xóa active class từ tất cả các nút
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Thêm active class cho nút được click
                    this.classList.add('active');
                    
                    // Lọc sản phẩm theo danh mục
                    const category = this.getAttribute('data-category');
                    filterProductsByCategory(category);
                });
            });
        }
    });
});

// Lọc sản phẩm theo danh mục
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const productCategory = card.getAttribute('data-category');
            if (productCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Sắp xếp sản phẩm
function sortProducts(sortType) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    const productCards = Array.from(productGrid.querySelectorAll('.product-card'));
    
    // Sắp xếp sản phẩm theo tiêu chí
    productCards.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        
        switch (sortType) {
            case 'price-asc':
                return priceA - priceB;
            case 'price-desc':
                return priceB - priceA;
            case 'newest':
                // Giả sử sản phẩm mới có data-id lớn hơn
                return parseInt(b.getAttribute('data-id')) - parseInt(a.getAttribute('data-id'));
            case 'bestseller':
                // Có thể thêm logic sắp xếp theo bán chạy ở đây
                return 0;
            default:
                return 0;
        }
    });
    
    // Xóa tất cả sản phẩm hiện tại
    productGrid.innerHTML = '';
    
    // Thêm lại sản phẩm đã sắp xếp
    productCards.forEach(card => {
        productGrid.appendChild(card);
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






