import Auth from './auth.js';

// Xử lý sự kiện thêm vào giỏ hàng (Sử dụng event delegation trên body)
document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật số lượng giỏ hàng khi tải trang
    // Hàm updateCartCount() được gọi từ cart.js
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }

    // Event delegation cho các nút thêm vào giỏ hàng và các hành động sản phẩm khác
    document.body.addEventListener('click', function(event) {
        const target = event.target;

        // Xử lý nút "Thêm vào giỏ hàng" (Bắt click trên icon hoặc nút)
        const addToCartButton = target.closest('.add-to-cart-btn') ||
                                target.closest('button[title="Thêm vào giỏ hàng"]') ||
                                (target.tagName === 'I' && target.classList.contains('fa-shopping-cart')); // Bắt click vào icon giỏ hàng trong product overlay

        if (addToCartButton) {
            event.preventDefault();

            // Tìm thẻ sản phẩm gần nhất có data-id
            const productCard = addToCartButton.closest('.product-card') || addToCartButton.closest('[data-id]');
            if (!productCard) {
                 console.error('Không tìm thấy thông tin sản phẩm để thêm vào giỏ hàng.');
                 // showToast('Không tìm thấy thông tin sản phẩm!', 'error'); // Tránh trùng lặp toast nếu cart.js cũng hiển thị
                 return;
            }

            // Lấy thông tin sản phẩm từ data attributes và nội dung HTML
            const productId = productCard.dataset.id;
            // Cố gắng lấy tên sản phẩm từ .product-title, nếu không có thì dùng fallback
            const productTitleElement = productCard.querySelector('.product-title') || productCard.querySelector('h3');
            const productTitle = productTitleElement ? productTitleElement.textContent.trim() : 'Sản phẩm không rõ tên';
            
            // Lấy giá từ data-price hoặc cố gắng phân tích từ text nếu cần
            const productPrice = parseFloat(productCard.dataset.price) || 0;
            
            // Lấy ảnh sản phẩm
            const productImageElement = productCard.querySelector('.product-image img') || productCard.querySelector('img');
            const productImage = productImageElement ? productImageElement.src : '';

            // Gọi hàm addToCart từ cart.js (đảm bảo cart.js được include trước main.js)
            if (typeof addToCart === 'function') {
                 addToCart({
                    id: productId,
                    name: productTitle,
                    price: productPrice,
                    image: productImage
                 });
                 // Có thể thêm hiệu ứng bay vào giỏ hàng ở đây nếu muốn (ví dụ: if (typeof createFlyToCartEffect === 'function') { createFlyToCartEffect(productCard); })

            } else {
                 console.error('Hàm addToCart không được định nghĩa hoặc không thể truy cập. Đảm bảo cart.js được include trước main.js.');
                 showToast('Lỗi hệ thống: Không thể thêm vào giỏ hàng (cart.js không tải đúng cách).', 'error');
            }
        }

        // Các xử lý click khác có thể thêm ở đây (ví dụ: xem nhanh sản phẩm)
        // ... existing code ...
    });

    // Xử lý nút tài khoản (Giữ nguyên)
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

    // Xử lý form đăng ký nhận thông tin (Giữ nguyên)
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Hiển thị thông báo thành công (Sử dụng showToast từ cart.js nếu main.js include cart.js)
                if (typeof showToast === 'function') {
                    showToast('Thành công', 'Đăng ký nhận thông tin thành công!', 'success');
                } else {
                    console.warn('Hàm showToast không khả dụng.');
                    alert('Đăng ký nhận thông tin thành công!'); // Fallback
                }
                
                // Reset form
                emailInput.value = '';
                
                // Lưu email vào localStorage (tùy chọn, giữ nguyên)
                saveSubscriber(email);
            }
        });
    }

    // Xử lý menu mobile (Giữ nguyên)
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Xử lý submenu trên mobile (Giữ nguyên)
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

    // Xử lý tìm kiếm (Giữ nguyên)
    const searchIcon = document.getElementById('searchIcon');
    const searchForm = document.getElementById('headerSearchForm');

    if (searchIcon && searchForm) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchForm.classList.toggle('active');
        });
    }
});

// Hàm lưu email người đăng ký (Giữ nguyên)
function saveSubscriber(email) {
    // Lấy danh sách đã đăng ký
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    
    // Kiểm tra email đã tồn tại chưa
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }
}

// Hàm hiển thị thông báo (Sử dụng showToast từ cart.js nếu có)
// Nếu showToast không có trong cart.js, hàm này có thể là fallback
// Đảm bảo chỉ có một định nghĩa hàm showToast hoạt động
function showNotification(message, type = 'info') {
    // Nếu showToast từ cart.js có sẵn, sử dụng nó
    if (typeof showToast === 'function') {
        let title = '';
        switch (type) {
            case 'success': title = 'Thành công'; break;
            case 'error': title = 'Lỗi'; break;
            case 'warning': title = 'Cảnh báo'; break;
            default: title = 'Thông báo';
        }
        showToast(title, message, type);
        return;
    }

    // Fallback: Tạo container thông báo nếu chưa có
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

// Hàm tạo hiệu ứng bay vào giỏ hàng (Giữ nguyên nếu bạn có CSS cho nó)
function createFlyToCartEffect(productElement) {
    // Tạo phần tử ảnh bay
    const flyingImg = document.createElement('img');
    const productImg = productElement.querySelector('img');
    
    // Kiểm tra nếu không tìm thấy ảnh sản phẩm thì dừng hiệu ứng
    if (!productImg) return;

    flyingImg.src = productImg.src;
    flyingImg.style.position = 'fixed';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.width = '50px'; // Kích thước ảnh bay
    flyingImg.style.height = 'auto';
    flyingImg.style.transition = 'all 1s ease-in-out'; // Hiệu ứng chuyển động
    flyingImg.style.top = productImg.getBoundingClientRect().top + 'px';
    flyingImg.style.left = productImg.getBoundingClientRect().left + 'px';
    flyingImg.style.pointerEvents = 'none'; // Không tương tác với chuột

    document.body.appendChild(flyingImg);

    // Lấy vị trí của icon giỏ hàng
    const cartIcon = document.querySelector('.icon-btn[title="Giỏ hàng"]');
    
    // Kiểm tra nếu không tìm thấy icon giỏ hàng thì dừng hiệu ứng
    if (!cartIcon) {
        flyingImg.remove(); // Xóa ảnh nếu không có đích đến
        return;
    }

    const cartRect = cartIcon.getBoundingClientRect();

    // Di chuyển ảnh đến vị trí của icon giỏ hàng
    setTimeout(() => {
        flyingImg.style.top = cartRect.top + 'px';
        flyingImg.style.left = cartRect.left + 'px';
        flyingImg.style.width = '20px'; // Giảm kích thước khi đến nơi
        flyingImg.style.opacity = '0'; // Mờ dần
    }, 50);

    // Xóa ảnh sau khi hiệu ứng kết thúc
    setTimeout(() => {
        flyingImg.remove();
    }, 1000);
}
