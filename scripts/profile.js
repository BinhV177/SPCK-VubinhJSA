document.addEventListener('DOMContentLoaded', function() {
    // Lấy thông tin người dùng từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                        JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Nếu chưa đăng nhập, chuyển về trang login
        window.location.href = 'login.html';
        return;
    }
    
    // Hiển thị thông tin người dùng
    displayUserInfo(currentUser);
    
    // Xử lý chuyển tab
    setupTabNavigation();
    
    // Xử lý form cập nhật thông tin
    setupProfileForm(currentUser);
    
    // Xử lý form đổi mật khẩu
    setupPasswordForm(currentUser);
    
    // Hiển thị đơn hàng
    displayOrders();
    
    // Xử lý nút đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });
    
    // Kiểm tra nếu URL có hash #orders thì chuyển đến tab đơn hàng
    if (window.location.hash === '#orders') {
        // Chuyển đến tab đơn hàng
        const ordersTab = document.querySelector('a[href="#orders"]');
        if (ordersTab) {
            // Xóa class active từ tất cả các tab
            document.querySelectorAll('.profile-nav a').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Thêm class active cho tab đơn hàng
            ordersTab.classList.add('active');
            
            // Ẩn tất cả các section
            document.querySelectorAll('.profile-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Hiển thị section đơn hàng
            document.getElementById('orders').style.display = 'block';
        }
    }
});

// Hiển thị thông tin người dùng
function displayUserInfo(user) {
    document.getElementById('userName').textContent = user.username || 'Người dùng';
    document.getElementById('userEmail').textContent = user.email || 'email@example.com';
    
    // Hiển thị avatar nếu có
    if (user.avatar) {
        document.getElementById('userAvatar').src = user.avatar;
    }
}

// Thiết lập chuyển tab
function setupTabNavigation() {
    const navLinks = document.querySelectorAll('.profile-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Xóa class active từ tất cả các tab
            navLinks.forEach(tab => tab.classList.remove('active'));
            
            // Thêm class active cho tab được click
            this.classList.add('active');
            
            // Lấy id của section cần hiển thị
            const targetId = this.getAttribute('href').substring(1);
            
            // Ẩn tất cả các section
            document.querySelectorAll('.profile-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Hiển thị section được chọn
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            
            // Cập nhật URL hash
            window.location.hash = targetId;
        });
    });
}

// Thiết lập form cập nhật thông tin
function setupProfileForm(user) {
    const profileForm = document.getElementById('profileForm');
    
    if (profileForm) {
        // Điền thông tin người dùng vào form
        profileForm.elements['fullName'].value = user.fullName || '';
        profileForm.elements['email'].value = user.email || '';
        profileForm.elements['phone'].value = user.phone || '';
        
        // Xử lý sự kiện submit form
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy thông tin từ form
            const fullName = this.elements['fullName'].value;
            const email = this.elements['email'].value;
            const phone = this.elements['phone'].value;
            
            // Cập nhật thông tin người dùng
            user.fullName = fullName;
            user.email = email;
            user.phone = phone;
            
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Hiển thị thông báo thành công
            showNotification('Cập nhật thông tin thành công!', 'success');
            
            // Cập nhật hiển thị
            document.getElementById('userName').textContent = fullName || user.username;
            document.getElementById('userEmail').textContent = email;
        });
    }
}

// Thiết lập form đổi mật khẩu
function setupPasswordForm(user) {
    const passwordForm = document.getElementById('passwordForm');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy thông tin từ form
            const currentPassword = this.elements['currentPassword'].value;
            const newPassword = this.elements['newPassword'].value;
            const confirmPassword = this.elements['confirmPassword'].value;
            
            // Kiểm tra mật khẩu hiện tại
            if (currentPassword !== user.password) {
                showNotification('Mật khẩu hiện tại không đúng!', 'error');
                return;
            }
            
            // Kiểm tra mật khẩu mới và xác nhận mật khẩu
            if (newPassword !== confirmPassword) {
                showNotification('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
                return;
            }
            
            // Cập nhật mật khẩu
            user.password = newPassword;
            
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Hiển thị thông báo thành công
            showNotification('Đổi mật khẩu thành công!', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// Hiển thị đơn hàng
function displayOrders() {
    const ordersSection = document.getElementById('orders');
    
    if (ordersSection) {
        // Lấy danh sách đơn hàng từ localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Lấy danh sách sản phẩm trong giỏ hàng
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Kiểm tra nếu có sản phẩm trong giỏ hàng nhưng chưa có trong đơn hàng
        if (cart.length > 0) {
            // Tìm đơn hàng đang xử lý
            let pendingOrder = orders.find(order => order.status === 'pending');
            
            if (!pendingOrder) {
                // Tạo đơn hàng mới nếu chưa có
                pendingOrder = {
                    id: generateOrderId(),
                    date: new Date().toISOString(),
                    status: 'pending',
                    items: cart,
                    total: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
                };
                orders.push(pendingOrder);
                
                // Lưu đơn hàng vào localStorage
                localStorage.setItem('orders', JSON.stringify(orders));
            } else {
                // Cập nhật items từ giỏ hàng vào đơn hàng đang xử lý
                pendingOrder.items = cart;
                pendingOrder.total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                localStorage.setItem('orders', JSON.stringify(orders));
            }
        }
        
        // Kiểm tra nếu không có đơn hàng
        if (orders.length === 0) {
            // Hiển thị thông báo không có đơn hàng
            ordersSection.innerHTML = `
                <div class="section-header">
                    <h3>Đơn hàng của tôi</h3>
                    <p class="section-description">Theo dõi và quản lý các đơn hàng của bạn</p>
                </div>
                <div class="empty-state elegant">
                    <div class="empty-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h4>Chưa có đơn hàng nào</h4>
                    <p>Bạn chưa có đơn hàng nào trong lịch sử mua sắm</p>
                    <a href="index.html" class="shop-now-btn">
                        <span>Mua sắm ngay</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            return;
        }
        
        // Hiển thị danh sách đơn hàng
        let ordersHTML = `
            <div class="section-header">
                <h3>Đơn hàng của tôi</h3>
                <p class="section-description">Theo dõi và quản lý các đơn hàng của bạn</p>
            </div>
            <div class="orders-filter">
                <div class="filter-group">
                    <label>Lọc theo trạng thái:</label>
                    <select id="orderStatusFilter">
                        <option value="all">Tất cả đơn hàng</option>
                        <option value="pending">Đang xử lý</option>
                        <option value="processing">Đang giao hàng</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Sắp xếp theo:</label>
                    <select id="orderSortFilter">
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                </div>
            </div>
        `;
        
        // Hiển thị giỏ hàng hiện tại (đơn hàng đang xử lý)
        const pendingOrder = orders.find(order => order.status === 'pending');
        
        if (pendingOrder && pendingOrder.items.length > 0) {
            ordersHTML += `
                <div class="order-card current-cart">
                    <div class="order-header">
                        <div class="order-info">
                            <h4>Giỏ hàng hiện tại</h4>
                            <div class="order-meta">
                                <span class="order-id">Mã: ${pendingOrder.id}</span>
                                <span class="order-date">Ngày: ${formatDate(pendingOrder.date)}</span>
                                <span class="order-status pending">Đang xử lý</span>
                            </div>
                        </div>
                        <div class="order-total">
                            <span>Tổng tiền:</span>
                            <strong>${formatCurrency(pendingOrder.total)}</strong>
                        </div>
                    </div>
                    <div class="order-items">
            `;
            
            // Hiển thị các sản phẩm trong giỏ hàng
            pendingOrder.items.forEach(item => {
                ordersHTML += `
                    <div class="order-item">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h5 class="item-name">${item.name}</h5>
                            <div class="item-meta">
                                <span class="item-price">${formatCurrency(item.price)}</span>
                                <span class="item-quantity">x${item.quantity}</span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="remove-item-btn" onclick="removeCartItem('${item.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                            <div class="quantity-controls">
                                <button class="quantity-btn minus-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn plus-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            ordersHTML += `
                    </div>
                    <div class="order-actions">
                        <button class="clear-cart-btn" onclick="clearCart()">Xóa giỏ hàng</button>
                        <button class="checkout-btn" onclick="proceedToCheckout()">Thanh toán</button>
                    </div>
                </div>
            `;
        }
        
        // Hiển thị các đơn hàng khác
        const otherOrders = orders.filter(order => order.status !== 'pending');
        
        if (otherOrders.length > 0) {
            ordersHTML += `<div class="orders-list">`;
            
            otherOrders.forEach(order => {
                ordersHTML += `
                    <div class="order-card" data-status="${order.status}">
                        <div class="order-header">
                            <div class="order-info">
                                <h4>Đơn hàng #${order.id}</h4>
                                <div class="order-meta">
                                    <span class="order-date">Ngày: ${formatDate(order.date)}</span>
                                    <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
                                </div>
                            </div>
                            <div class="order-total">
                                <span>Tổng tiền:</span>
                                <strong>${formatCurrency(order.total)}</strong>
                            </div>
                        </div>
                        <div class="order-items collapsed">
                `;
                
                // Hiển thị các sản phẩm trong đơn hàng
                order.items.forEach(item => {
                    ordersHTML += `
                        <div class="order-item">
                            <div class="item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="item-details">
                                <h5 class="item-name">${item.name}</h5>
                                <div class="item-meta">
                                    <span class="item-price">${formatCurrency(item.price)}</span>
                                    <span class="item-quantity">x${item.quantity}</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                ordersHTML += `
                        </div>
                        <div class="order-actions">
                            <button class="toggle-items-btn" onclick="toggleOrderItems(this)">
                                <span class="show-text">Xem chi tiết</span>
                                <span class="hide-text">Ẩn chi tiết</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            ordersHTML += `</div>`;
        }
        
        // Cập nhật nội dung
        ordersSection.innerHTML = ordersHTML;
        
        // Xử lý lọc đơn hàng
        const statusFilter = document.getElementById('orderStatusFilter');
        const sortFilter = document.getElementById('orderSortFilter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', filterOrders);
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', filterOrders);
        }
    }
}

// Hàm lọc đơn hàng
function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const orderCards = document.querySelectorAll('.order-card:not(.current-cart)');
    
    orderCards.forEach(card => {
        const status = card.getAttribute('data-status');
        
        if (statusFilter === 'all' || status === statusFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Hàm hiển thị/ẩn chi tiết đơn hàng
function toggleOrderItems(button) {
    const orderCard = button.closest('.order-card');
    const itemsContainer = orderCard.querySelector('.order-items');
    
    itemsContainer.classList.toggle('collapsed');
    orderCard.classList.toggle('expanded');
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeCartItem(productId) {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Xóa sản phẩm khỏi giỏ hàng
    cart = cart.filter(item => item.id !== productId);
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật đơn hàng
    updatePendingOrder();
    
    // Cập nhật hiển thị
    displayOrders();
    
    // Cập nhật số lượng hiển thị
    updateCartCount();
    
    // Hiển thị thông báo
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
}

// Hàm cập nhật số lượng sản phẩm
function updateCartItemQuantity(productId, newQuantity) {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (newQuantity <= 0) {
            // Nếu số lượng <= 0, xóa sản phẩm
            removeCartItem(productId);
        } else {
            // Cập nhật số lượng
            cart[itemIndex].quantity = newQuantity;
            
            // Lưu giỏ hàng vào localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Cập nhật đơn hàng
            updatePendingOrder();
            
            // Cập nhật hiển thị
            displayOrders();
            
            // Cập nhật số lượng hiển thị
            updateCartCount();
        }
    }
}

// Hàm xóa giỏ hàng
function clearCart() {
    // Xóa giỏ hàng
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Xóa đơn hàng đang xử lý
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(order => order.status !== 'pending');
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Cập nhật hiển thị
    displayOrders();
    
    // Cập nhật số lượng hiển thị
    updateCartCount();
    
    // Hiển thị thông báo
    showNotification('Đã xóa giỏ hàng!', 'success');
}

// Hàm thanh toán
function proceedToCheckout() {
    // Lấy đơn hàng đang xử lý
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const pendingOrderIndex = orders.findIndex(order => order.status === 'pending');
    
    if (pendingOrderIndex !== -1) {
        // Cập nhật trạng thái đơn hàng
        orders[pendingOrderIndex].status = 'processing';
        orders[pendingOrderIndex].checkoutDate = new Date().toISOString();
        
        // Lưu đơn hàng vào localStorage
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Xóa giỏ hàng
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Cập nhật hiển thị
        displayOrders();
        
        // Cập nhật số lượng hiển thị
        updateCartCount();
        
        // Hiển thị thông báo
        showNotification('Đặt hàng thành công!', 'success');
    }
}

// Hàm cập nhật đơn hàng đang xử lý
function updatePendingOrder() {
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Lấy danh sách đơn hàng
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Tìm đơn hàng đang xử lý
    const pendingOrderIndex = orders.findIndex(order => order.status === 'pending');
    
    if (pendingOrderIndex !== -1) {
        if (cart.length === 0) {
            // Nếu giỏ hàng trống, xóa đơn hàng đang xử lý
            orders.splice(pendingOrderIndex, 1);
        } else {
            // Cập nhật đơn hàng
            orders[pendingOrderIndex].items = cart;
            orders[pendingOrderIndex].total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        
        // Lưu đơn hàng vào localStorage
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// Hàm cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(badge => {
        badge.textContent = count;
    });
}

// Hàm format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Hàm format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Hàm lấy text trạng thái
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'Đang xử lý';
        case 'processing':
            return 'Đang giao hàng';
        case 'completed':
            return 'Đã hoàn thành';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
}

// Tạo ID đơn hàng
function generateOrderId() {
    return 'ORD' + Date.now().toString().slice(-6);
}

// Đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer') || document.createElement('div');
    
    if (!document.getElementById('notificationContainer')) {
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
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
