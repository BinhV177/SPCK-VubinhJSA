import Auth from './auth.js';

// Xử lý sự kiện thêm vào giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật số lượng giỏ hàng khi tải trang
    updateCartCount();
    
    // Xử lý tất cả các nút thêm vào giỏ hàng
    document.addEventListener('click', function(e) {
        // Kiểm tra nếu click vào nút giỏ hàng (cả nút text và nút icon)
        const cartButton = e.target.closest('.cart-icon-btn') || 
                          e.target.closest('button[title="Thêm vào giỏ hàng"]') ||
                          e.target.closest('.add-to-cart-btn') ||
                          (e.target.tagName === 'I' && e.target.classList.contains('fa-shopping-cart'));
        
        if (cartButton) {
            e.preventDefault();
            
            // Tìm thẻ sản phẩm gần nhất
            const productCard = cartButton.closest('.product-card');
            if (!productCard) return;
            
            // Lấy thông tin sản phẩm
            const productId = productCard.getAttribute('data-id');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.getAttribute('data-price'));
            const productImage = productCard.querySelector('img').src;
            
            // Thêm sản phẩm vào giỏ hàng
            const added = addToCart({
                id: productId,
                name: productTitle,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            
            if (added) {
                // Hiển thị thông báo thành công
                showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
                
                // Hiệu ứng bay vào giỏ hàng
                createFlyToCartEffect(productCard);
            }
        }
    });

    updateWishlistCount();
    updateCartCount();
});

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        cart[existingItemIndex].quantity += product.quantity;
    } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        cart.push(product);
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật số lượng hiển thị
    updateCartCount();
    
    // Thêm vào đơn hàng trong profile
    addToOrders(product);
    
    return true;
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(badge => {
        badge.textContent = count;
    });
}

// Thêm sản phẩm vào đơn hàng trong profile
function addToOrders(product) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Kiểm tra xem đã có đơn hàng đang xử lý chưa
    let currentOrder = orders.find(order => order.status === 'pending');
    
    if (!currentOrder) {
        // Tạo đơn hàng mới nếu chưa có
        currentOrder = {
            id: generateOrderId(),
            date: new Date().toISOString(),
            status: 'pending',
            items: [],
            total: 0
        };
        orders.push(currentOrder);
    }
    
    // Kiểm tra sản phẩm đã tồn tại trong đơn hàng chưa
    const existingItemIndex = currentOrder.items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        currentOrder.items[existingItemIndex].quantity += product.quantity;
    } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        currentOrder.items.push(product);
    }
    
    // Cập nhật tổng tiền
    currentOrder.total = currentOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Lưu đơn hàng vào localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Tạo ID đơn hàng
function generateOrderId() {
    return 'ORD' + Date.now().toString().slice(-6);
}

// Xử lý nút tài khoản
document.querySelector('.icon-btn[title="Tài khoản"]').addEventListener('click', function(e) {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    if (user) {
        // Nếu đã đăng nhập, chuyển đến trang profile
        window.location.href = 'profile.html';
    } else {
        // Nếu chưa đăng nhập, chuyển đến trang login
        window.location.href = 'login.html';
    }
}); 

// Xử lý form đăng ký nhận thông tin
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Hiển thị thông báo thành công
                showNotification('Đăng ký nhận thông tin thành công!', 'success');
                
                // Reset form
                emailInput.value = '';
                
                // Lưu email vào localStorage (tùy chọn)
                saveSubscriber(email);
            }
        });
    }
});

// Hàm lưu email người đăng ký
function saveSubscriber(email) {
    // Lấy danh sách đã đăng ký
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    
    // Kiểm tra email đã tồn tại chưa
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'info') {
    // Tạo container thông báo nếu chưa có
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Thêm icon phù hợp
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    notification.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(notification);
    
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}

// Xử lý menu mobile
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Xử lý submenu trên mobile
const hasSubmenu = document.querySelectorAll('.has-submenu');

hasSubmenu.forEach(item => {
    item.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'I') {
            e.preventDefault();
            this.classList.toggle('active');
            const submenu = this.querySelector('.submenu');
            if (submenu) {
                if (submenu.style.maxHeight) {
                    submenu.style.maxHeight = null;
                } else {
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                }
            }
        }
    });
});

// Xử lý tìm kiếm
const searchIcon = document.getElementById('searchIcon');
const searchForm = document.getElementById('headerSearchForm');

if (searchIcon && searchForm) {
    searchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        searchForm.classList.toggle('active');
    });
}

// Hiệu ứng bay vào giỏ hàng
function createFlyToCartEffect(productElement) {
    // Tạo phần tử ảnh bay
    const flyingImg = document.createElement('img');
    const productImg = productElement.querySelector('img');
    
    // Lấy vị trí của sản phẩm và giỏ hàng
    const productRect = productImg.getBoundingClientRect();
    const cartIcon = document.querySelector('.icon-btn[title="Giỏ hàng"]') || 
                    document.querySelector('.fa-shopping-bag').closest('a');
    
    if (!cartIcon) return;
    
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Thiết lập style cho ảnh bay
    flyingImg.src = productImg.src;
    flyingImg.style.position = 'fixed';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.width = `${productRect.width}px`;
    flyingImg.style.height = `${productRect.height}px`;
    flyingImg.style.top = `${productRect.top}px`;
    flyingImg.style.left = `${productRect.left}px`;
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.borderRadius = '4px';
    flyingImg.style.pointerEvents = 'none';
    
    document.body.appendChild(flyingImg);
    
    // Thiết lập animation
    const keyframes = [
        { // Vị trí bắt đầu
            top: `${productRect.top}px`,
            left: `${productRect.left}px`,
            width: `${productRect.width}px`,
            height: `${productRect.height}px`,
            opacity: 0.8,
            transform: 'scale(1)'
        },
        { // Vị trí giữa
            top: `${(productRect.top + cartRect.top) / 2 - 50}px`,
            left: `${(productRect.left + cartRect.left) / 2}px`,
            width: `${productRect.width / 2}px`,
            height: `${productRect.height / 2}px`,
            opacity: 0.6,
            transform: 'scale(0.8)'
        },
        { // Vị trí kết thúc
            top: `${cartRect.top}px`,
            left: `${cartRect.left}px`,
            width: '20px',
            height: '20px',
            opacity: 0.2,
            transform: 'scale(0.3)'
        }
    ];
    
    const options = {
        duration: 800,
        easing: 'ease-in-out',
        fill: 'forwards'
    };
    
    // Chạy animation
    const animation = flyingImg.animate(keyframes, options);
    
    // Xóa phần tử sau khi animation kết thúc
    animation.onfinish = () => {
        flyingImg.remove();
        
        // Hiệu ứng nhấp nháy giỏ hàng
        cartIcon.classList.add('cart-pulse');
        setTimeout(() => {
            cartIcon.classList.remove('cart-pulse');
        }, 500);
    };
}

// Cập nhật số lượng sản phẩm yêu thích
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBadge = document.querySelector('.wishlist-badge');
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlist.length;
    }
}

// Cập nhật trạng thái icon yêu thích
function updateWishlistIcon(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.some(item => item.id === productId);
    const wishlistIcon = document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`);
    
    if (wishlistIcon) {
        if (isInWishlist) {
            wishlistIcon.classList.add('active');
            wishlistIcon.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            wishlistIcon.classList.remove('active');
            wishlistIcon.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}
