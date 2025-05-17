// Lớp Cart để quản lý giỏ hàng
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }
    
    // Thêm sản phẩm vào giỏ hàng
    addItem(product) {
        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Nếu đã có, tăng số lượng
            this.items[existingItemIndex].quantity += 1;
        } else {
            // Nếu chưa có, thêm mới
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Lưu giỏ hàng vào localStorage
        this.saveCart();
        
        // Cập nhật số lượng hiển thị
        this.updateCartCount();
        
        console.log('Đã thêm sản phẩm vào giỏ hàng:', product);
        
        return this.items;
    }
    
    // Xóa sản phẩm khỏi giỏ hàng
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        return this.items;
    }
    
    // Cập nhật số lượng sản phẩm
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            item.quantity = quantity;
            
            // Nếu số lượng = 0, xóa sản phẩm
            if (item.quantity <= 0) {
                return this.removeItem(productId);
            }
            
            this.saveCart();
            this.updateCartCount();
        }
        
        return this.items;
    }
    
    // Xóa tất cả sản phẩm trong giỏ hàng
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        return this.items;
    }
    
    // Lưu giỏ hàng vào localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        
        const cartBadges = document.querySelectorAll('.cart-badge');
        cartBadges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
        
        return count;
    }
    
    // Tính tổng tiền giỏ hàng
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

// Hiển thị giỏ hàng
function renderCart() {
    console.log('Đang hiển thị giỏ hàng');
    
    // Lấy các phần tử DOM
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer) {
        console.error('Không tìm thấy phần tử .cart-items');
        return;
    }
    
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Giỏ hàng từ localStorage:', cart);
    
    // Kiểm tra giỏ hàng trống
    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (emptyCartMessage) emptyCartMessage.style.display = 'flex';
        if (cartSummary) cartSummary.style.display = 'none';
        console.log('Giỏ hàng trống, hiển thị thông báo');
        return;
    }
    
    // Hiển thị giỏ hàng
    if (cartItemsContainer) cartItemsContainer.style.display = 'block';
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    console.log('Hiển thị', cart.length, 'sản phẩm trong giỏ hàng');
    
    // Hiển thị các sản phẩm trong giỏ hàng
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-price">${formatPrice(item.price)}₫</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-quantity">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                <button class="quantity-btn increase-quantity">+</button>
            </div>
            <div class="cart-item-subtotal">
                ${formatPrice(item.price * item.quantity)}₫
            </div>
            <button class="remove-item" title="Xóa sản phẩm">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Cập nhật tổng tiền
    updateCartSummary();
}

// Cập nhật tổng tiền giỏ hàng
function updateCartSummary() {
    console.log('Đang cập nhật tổng tiền giỏ hàng');
    
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Tính tổng tiền
    let subtotal = 0;
    for (const item of cart) {
        // Đảm bảo price là số
        let price = item.price;
        if (typeof price === 'string') {
            price = parseFloat(price.replace(/[^\d]/g, ''));
        }
        
        const quantity = parseInt(item.quantity) || 0;
        subtotal += price * quantity;
    }
    
    console.log('Tổng tiền:', subtotal);
    
    // Cập nhật hiển thị tổng tiền trong trang giỏ hàng
    // Dựa vào ảnh bạn chia sẻ, cần cập nhật các phần tử sau:
    
    // 1. Phần "Tạm tính"
    document.querySelectorAll('.tam-tinh, #subtotal').forEach(el => {
        if (el) {
            el.textContent = `${formatPrice(subtotal)}₫`;
            console.log('Đã cập nhật tạm tính:', el.textContent);
        }
    });
    
    // 2. Phần "Tổng cộng"
    document.querySelectorAll('.tong-cong, #total').forEach(el => {
        if (el) {
            el.textContent = `${formatPrice(subtotal)}₫`;
            console.log('Đã cập nhật tổng cộng:', el.textContent);
        }
    });
    
    // 3. Cập nhật theo cấu trúc HTML trong ảnh
    document.querySelectorAll('.order-total-row span:last-child').forEach(el => {
        const label = el.closest('.order-total-row').querySelector('span:first-child');
        if (label && label.textContent.includes('Tạm tính')) {
            el.textContent = `${formatPrice(subtotal)}₫`;
            console.log('Đã cập nhật tạm tính (theo cấu trúc)');
        }
        if (label && label.textContent.includes('Tổng cộng')) {
            el.textContent = `${formatPrice(subtotal)}₫`;
            console.log('Đã cập nhật tổng cộng (theo cấu trúc)');
        }
    });
    
    // 4. Cập nhật trực tiếp các phần tử có ID
    const tamTinhElement = document.getElementById('subtotal');
    const tongCongElement = document.getElementById('total');
    
    if (tamTinhElement) {
        tamTinhElement.textContent = `${formatPrice(subtotal)}₫`;
    }
    
    if (tongCongElement) {
        tongCongElement.textContent = `${formatPrice(subtotal)}₫`;
    }
    
    // 5. Thử cập nhật theo class
    const tamTinhByClass = document.querySelector('.order-total-row:first-child span:last-child');
    const tongCongByClass = document.querySelector('.order-total-row.total span:last-child');
    
    if (tamTinhByClass) {
        tamTinhByClass.textContent = `${formatPrice(subtotal)}₫`;
    }
    
    if (tongCongByClass) {
        tongCongByClass.textContent = `${formatPrice(subtotal)}₫`;
    }
}

// Định dạng giá tiền
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingProductIndex].quantity += product.quantity || 1;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity || 1
        });
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartBadge();
    
    return true;
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Lọc sản phẩm cần xóa
    cart = cart.filter(item => item.id != productId);
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật hiển thị
    renderCart();
    updateCartBadge();
}

// Cập nhật số lượng sản phẩm
function updateQuantity(productId, change) {
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Tìm sản phẩm trong giỏ hàng
    const productIndex = cart.findIndex(item => item.id == productId);
    
    if (productIndex !== -1) {
        // Cập nhật số lượng
        cart[productIndex].quantity += change;
        
        // Đảm bảo số lượng không nhỏ hơn 1
        if (cart[productIndex].quantity < 1) {
            cart[productIndex].quantity = 1;
        }
        
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Cập nhật hiển thị
        renderCart();
        updateCartBadge();
    }
}

// Xóa tất cả sản phẩm trong giỏ hàng
function clearCart() {
    // Xóa giỏ hàng trong localStorage
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Cập nhật hiển thị
    renderCart();
    updateCartBadge();
}

// Tạo hiệu ứng bay vào giỏ hàng
function createFlyToCartEffect(productElement, cartIcon) {
    // Lấy vị trí của sản phẩm
    const productRect = productElement.getBoundingClientRect();
    
    // Lấy vị trí của icon giỏ hàng
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Tạo phần tử bay
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    
    // Lấy hình ảnh sản phẩm
    const productImage = productElement.querySelector('.product-image img');
    if (productImage) {
        flyingItem.style.backgroundImage = `url(${productImage.src})`;
    } else {
        flyingItem.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    }
    
    // Thiết lập vị trí ban đầu
    flyingItem.style.position = 'fixed';
    flyingItem.style.top = productRect.top + 'px';
    flyingItem.style.left = productRect.left + 'px';
    flyingItem.style.width = '50px';
    flyingItem.style.height = '50px';
    flyingItem.style.backgroundSize = 'cover';
    flyingItem.style.backgroundPosition = 'center';
    flyingItem.style.borderRadius = '50%';
    flyingItem.style.zIndex = '9999';
    flyingItem.style.opacity = '0.8';
    flyingItem.style.transition = 'all 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    
    // Thêm vào body
    document.body.appendChild(flyingItem);
    
    // Bắt đầu animation
    setTimeout(() => {
        flyingItem.style.top = cartRect.top + 'px';
        flyingItem.style.left = cartRect.left + 'px';
        flyingItem.style.opacity = '0';
        flyingItem.style.transform = 'scale(0.1)';
        
        // Hiệu ứng nhấp nháy giỏ hàng
        setTimeout(() => {
            cartIcon.classList.add('cart-pulse');
            
            // Cập nhật số lượng hiển thị
            updateCartBadge();
            
            // Xóa phần tử bay và hiệu ứng nhấp nháy
            setTimeout(() => {
                flyingItem.remove();
                cartIcon.classList.remove('cart-pulse');
            }, 500);
        }, 800);
    }, 10);
}

// Thiết lập các sự kiện khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    console.log('Trang giỏ hàng đã tải xong');
    
    // Hiển thị giỏ hàng
    renderCart();
    
    // Cập nhật tổng tiền
    updateCartSummary();
    
    // Thiết lập các sự kiện
    setupEventListeners();
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartBadge();
    
    // Thêm một timeout để đảm bảo DOM đã được cập nhật
    setTimeout(updateCartSummary, 500);
});

// Thiết lập các sự kiện
function setupEventListeners() {
    // Xử lý sự kiện thay đổi số lượng và xóa sản phẩm
    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(e) {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;
            
            const productId = cartItem.dataset.id;
            
            // Xử lý nút tăng số lượng
            if (e.target.closest('.increase-quantity')) {
                console.log('Tăng số lượng sản phẩm:', productId);
                updateQuantity(productId, 1);
                updateCartSummary(); // Cập nhật tổng tiền sau khi thay đổi số lượng
            }
            
            // Xử lý nút giảm số lượng
            if (e.target.closest('.decrease-quantity')) {
                console.log('Giảm số lượng sản phẩm:', productId);
                updateQuantity(productId, -1);
                updateCartSummary(); // Cập nhật tổng tiền sau khi thay đổi số lượng
            }
            
            // Xử lý nút xóa sản phẩm
            if (e.target.closest('.remove-item')) {
                console.log('Xóa sản phẩm:', productId);
                removeFromCart(productId);
                updateCartSummary(); // Cập nhật tổng tiền sau khi xóa sản phẩm
            }
        });
    }
    
    // Xử lý nút xóa tất cả
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            clearCart();
            updateCartSummary(); // Cập nhật tổng tiền sau khi xóa tất cả
        });
    }
    
    // Xử lý nút thanh toán
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống!');
                return;
            }
            
            // Hiển thị thông báo thanh toán thành công
            alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
            
            // Xóa giỏ hàng
            localStorage.setItem('cart', JSON.stringify([]));
            
            // Cập nhật hiển thị
            renderCart();
            updateCartBadge();
            
            // Chuyển về trang chủ sau 1 giây
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

// Thêm sản phẩm mẫu vào giỏ hàng
function addSampleProduct() {
    const sampleProduct = {
        id: 1,
        name: 'Sản phẩm mẫu',
        price: 100000,
        image: './assets/sample-product.jpg',
        quantity: 1
    };
    
    if (addToCart(sampleProduct)) {
        showNotification('Sản phẩm đã được thêm vào giỏ hàng!', 'success');
    }
}

// Thêm nút test vào trang (chỉ để phát triển)
document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.createElement('button');
    testButton.textContent = 'Thêm sản phẩm mẫu';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '20px';
    testButton.style.right = '20px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '10px';
    testButton.style.backgroundColor = '#3498db';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', function() {
        addSampleProduct();
    });
    
    document.body.appendChild(testButton);
});

// Tạo mã đơn hàng
function generateOrderId() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CB${timestamp}${random}`;
}

// Lưu đơn hàng vào localStorage
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Thêm đơn hàng mới
    orders.push(order);
    
    // Lưu lại vào localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('Đã lưu đơn hàng:', order);
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    console.log(`Thông báo (${type}): ${message}`);
    
    // Kiểm tra xem đã có container thông báo chưa
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Tạo phần tử thông báo
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
    
    notification.innerHTML = `
        <div class="notification-content">
            ${icon}
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        </div>
    `;
    
    // Thêm vào container
    notificationContainer.appendChild(notification);
    
    // Hiển thị thông báo
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            
            // Xóa container nếu không còn thông báo
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300);
    }, 3000);
    
    // Xử lý nút đóng
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                
                // Xóa container nếu không còn thông báo
                if (notificationContainer.children.length === 0) {
                    notificationContainer.remove();
                }
            }, 300);
        });
    }
}

// Thêm hàm để cập nhật tổng tiền trực tiếp
function updateTotalDirectly() {
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Tính tổng tiền
    let total = 0;
    for (const item of cart) {
        let price = item.price;
        if (typeof price === 'string') {
            price = parseFloat(price.replace(/[^\d]/g, ''));
        }
        
        const quantity = parseInt(item.quantity) || 0;
        total += price * quantity;
    }
    
    // Cập nhật trực tiếp vào DOM
    const priceElements = document.querySelectorAll('.tam-tinh, .tong-cong, #subtotal, #total');
    priceElements.forEach(el => {
        if (el) el.textContent = `${formatPrice(total)}₫`;
    });
    
    console.log('Đã cập nhật tổng tiền trực tiếp:', total);
    return total;
}

// Thêm nút để cập nhật tổng tiền (chỉ để test)
function addUpdateButton() {
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Cập nhật tổng tiền';
    updateButton.style.position = 'fixed';
    updateButton.style.bottom = '60px';
    updateButton.style.right = '20px';
    updateButton.style.zIndex = '9999';
    updateButton.style.padding = '10px';
    updateButton.style.backgroundColor = '#e74c3c';
    updateButton.style.color = 'white';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '5px';
    updateButton.style.cursor = 'pointer';
    
    updateButton.addEventListener('click', function() {
        updateTotalDirectly();
    });
    
    document.body.appendChild(updateButton);
}

// Thêm nút cập nhật khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    addUpdateButton();
});


