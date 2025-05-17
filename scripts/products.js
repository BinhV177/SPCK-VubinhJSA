document.addEventListener('DOMContentLoaded', function() {
    // Lấy sản phẩm từ 3 trang và hiển thị
    const products = getAllProducts();
    renderProducts(products);
    
    // Thiết lập bộ lọc
    setupFilters();
});

// Lấy tất cả sản phẩm từ 3 trang
function getAllProducts() {
    // Sản phẩm nữ từ women.html
    const womenProducts = [
        {
            id: 1,
            name: "Áo Blazer Nữ Công Sở",
            price: 1590000,
            category: "women",
            subCategory: "blazer",
            isNew: true,
            image: "./assets/blazernucongso.jpg"
        },
        {
            id: 2,
            name: "Váy Đầm Dự Tiệc",
            price: 2190000,
            salePrice: 1890000,
            category: "women",
            subCategory: "dress",
            isSale: true,
            image: "./assets/vaydamdutiec.jpg"
        },
        {
            id: 3,
            name: "Áo Sơ Mi Nữ Công Sở",
            price: 590000,
            category: "women",
            subCategory: "shirt",
            image: "./assets/aosominucongso.jpg"
        },
        {
            id: 4,
            name: "Quần Âu Nữ",
            price: 890000,
            salePrice: 690000,
            category: "women",
            subCategory: "pants",
            isSale: true,
            image: "./assets/quanaunu.jpg"
        },
        {
            id: 5,
            name: "Chân Váy Xếp Ly",
            price: 790000,
            category: "women",
            subCategory: "skirt",
            image: "./assets/chanvayxeply.jpeg"
        }
    ];
    
    // Sản phẩm nam từ men.html
    const menProducts = [
        {
            id: 101,
            name: "Bộ Vest Nam Công Sở",
            price: 1890000,
            category: "men",
            subCategory: "suit",
            isNew: true,
            image: "./assets/vest-nam-1.jpg"
        },
        {
            id: 102,
            name: "Áo Sơ Mi Nam",
            price: 650000,
            salePrice: 550000,
            category: "men",
            subCategory: "shirt",
            isSale: true,
            image: "./assets/ao-so-mi-nam-1.jpg"
        },
        {
            id: 103,
            name: "Quần Jeans Nam",
            price: 750000,
            category: "men",
            subCategory: "pants",
            image: "./assets/quan-jean-nam-1.jpeg"
        }
    ];
    
    // Sản phẩm phụ kiện từ accessories.html
    const accessoriesProducts = [
        {
            id: 201,
            name: "Túi Xách Nữ Thời Trang",
            price: 1290000,
            category: "accessories",
            subCategory: "bag",
            isNew: true,
            image: "./assets/tuixacnuthoitrang.webp"
        },
        {
            id: 202,
            name: "Đồng Hồ Nam Cao Cấp",
            price: 2590000,
            salePrice: 2190000,
            category: "accessories",
            subCategory: "watch",
            isSale: true,
            image: "./assets/donghonamcaocap.jpg"
        }
    ];
    
    return [...womenProducts, ...menProducts, ...accessoriesProducts];
}

// Hiển thị sản phẩm
function renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const priceDisplay = product.salePrice ? 
            `<span class="current-price">${formatPrice(product.salePrice)}₫</span>
             <span class="original-price">${formatPrice(product.price)}₫</span>` :
            `<span class="current-price">${formatPrice(product.price)}₫</span>`;
        
        const badge = product.isNew ? '<span class="new-badge">Mới</span>' : 
                     (product.isSale ? '<span class="sale-badge">Sale</span>' : '');
        
        productGrid.innerHTML += `
            <div class="product-card" data-id="${product.id}" data-price="${product.salePrice || product.price}" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${badge}
                    <div class="product-overlay">
                        <button title="Xem nhanh" class="quick-view-btn"><i class="fas fa-eye"></i></button>
                        <button title="Thêm vào giỏ hàng" class="cart-icon-btn"><i class="fas fa-shopping-cart"></i></button>
                        <button title="Yêu thích" class="wishlist-btn"><i class="far fa-heart"></i></button>
                    </div>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${priceDisplay}
                </div>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                    <span>(4.0)</span>
                </div>
            </div>
        `;
    });
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Thiết lập bộ lọc
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortFilter');
    
    // Xử lý lọc theo danh mục
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const products = getAllProducts();
            
            let filteredProducts = products;
            if (category !== 'all') {
                if (category === 'sale') {
                    filteredProducts = products.filter(p => p.isSale);
                } else if (category === 'new') {
                    filteredProducts = products.filter(p => p.isNew);
                } else {
                    filteredProducts = products.filter(p => p.category === category);
                }
            }
            
            renderProducts(filteredProducts);
        });
    });
    
    // Xử lý sắp xếp
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
            const products = getAllProducts();
            
            let filteredProducts = products;
            if (activeCategory !== 'all') {
                if (activeCategory === 'sale') {
                    filteredProducts = products.filter(p => p.isSale);
                } else if (activeCategory === 'new') {
                    filteredProducts = products.filter(p => p.isNew);
                } else {
                    filteredProducts = products.filter(p => p.category === activeCategory);
                }
            }
            
            // Sắp xếp
            const sortValue = this.value;
            if (sortValue === 'price-asc') {
                filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
            } else if (sortValue === 'price-desc') {
                filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
            }
            
            renderProducts(filteredProducts);
        });
    }
}

// Xử lý menu mobile
function setupMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburgerMenu && mobileMenu) {
        hamburgerMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }
    
    // Xử lý submenu trên mobile
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');
    
    hasSubmenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'I') {
                e.preventDefault();
                this.classList.toggle('submenu-active');
            }
        });
    });
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) return;
    
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Cập nhật số lượng
    cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Xử lý sự kiện click trên sản phẩm
document.addEventListener('click', function(e) {
    // Xử lý nút thêm vào giỏ hàng
    if (e.target.closest('.cart-icon-btn') || e.target.closest('button[title="Thêm vào giỏ hàng"]')) {
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.getAttribute('data-id'));
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('.product-image img').src;
        
        // Thêm sản phẩm vào giỏ hàng
        addToCart({
            id: productId,
            name: productName,
            price: parseFloat(productPrice.replace(/[^\d]/g, '')),
            image: productImage,
            quantity: 1
        });
        
        // Cập nhật số lượng giỏ hàng
        updateCartCount();
    }
    
    // Xử lý nút yêu thích
    if (e.target.closest('.wishlist-btn') || e.target.closest('button[title="Yêu thích"]')) {
        const heartIcon = e.target.closest('button').querySelector('i');
        
        // Toggle trạng thái yêu thích
        if (heartIcon.classList.contains('far')) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            heartIcon.style.color = '#e74c3c';
            showNotification('Đã thêm vào danh sách yêu thích!', 'success');
        } else {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            heartIcon.style.color = '';
            showNotification('Đã xóa khỏi danh sách yêu thích!', 'info');
        }
    }
    
    // Xử lý nút xem nhanh
    if (e.target.closest('.quick-view-btn') || e.target.closest('button[title="Xem nhanh"]')) {
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.getAttribute('data-id'));
        
        // Hiển thị modal xem nhanh (có thể thêm sau)
        showNotification('Chức năng xem nhanh đang được phát triển!', 'info');
    }
});

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push(product);
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật số lượng giỏ hàng
    updateCartCount();
    
    return true;
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    // Kiểm tra xem đã có container thông báo chưa
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        // Nếu chưa có, tạo mới
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon cho thông báo
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
        default:
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    notification.innerHTML = `${icon}<span>${message}</span>`;
    notificationContainer.appendChild(notification);
    
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Tạo hiệu ứng bay vào giỏ hàng
function createFlyToCartEffect(fromElement, toElement) {
    if (!fromElement || !toElement) return;
    
    // Tạo phần tử bay
    const flyingElement = document.createElement('div');
    flyingElement.className = 'flying-item';
    flyingElement.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    document.body.appendChild(flyingElement);
    
    // Lấy vị trí
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    
    // Thiết lập vị trí ban đầu
    flyingElement.style.cssText = `
        position: fixed;
        z-index: 9999;
        left: ${fromRect.left + fromRect.width / 2}px;
        top: ${fromRect.top + fromRect.height / 2}px;
        transform: translate(-50%, -50%);
        font-size: 20px;
        color: #2196F3;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    `;
    
    // Kích hoạt animation
    setTimeout(() => {
        flyingElement.style.cssText += `
            left: ${toRect.left + toRect.width / 2}px;
            top: ${toRect.top + toRect.height / 2}px;
            font-size: 0;
            opacity: 0;
        `;
        
        // Làm nổi bật giỏ hàng
        toElement.classList.add('cart-pulse');
        
        // Xóa phần tử bay và hiệu ứng nổi bật sau khi hoàn thành
        setTimeout(() => {
            flyingElement.remove();
            toElement.classList.remove('cart-pulse');
        }, 800);
    }, 10);
}
