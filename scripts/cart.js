// Lớp giỏ hàng
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.render();
        this.updateTotal();
    }
    
    // Thêm sản phẩm vào giỏ hàng
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.render();
        this.updateTotal();
        
        return true;
    }
    
    // Cập nhật số lượng sản phẩm
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            item.quantity = Math.max(0, quantity);
            
            if (item.quantity === 0) {
                this.removeItem(productId);
            }
        }
        
        this.saveCart();
        this.render();
        this.updateTotal();
        
        return true;
    }
    
    // Xóa sản phẩm khỏi giỏ hàng
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.render();
        this.updateTotal();
        
        return true;
    }
    
    // Lấy tất cả sản phẩm trong giỏ hàng
    getItems() {
        return this.items;
    }
    
    // Tính tổng tiền
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Đếm số lượng sản phẩm
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    // Lưu giỏ hàng vào localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    // Xóa giỏ hàng
    clearCart() {
        this.items = [];
        this.saveCart();
        this.render();
        this.updateTotal();
    }
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = this.getItemCount();
        }
    }

    render() {
        const cartItems = document.querySelector('.cart-items');
        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${item.price.toLocaleString('vi-VN')}đ</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button onclick="cart.removeItem('${item.id}')">Xóa</button>
            </div>
        `).join('');
    }

    updateTotal() {
        const subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 30000 : 0; // Phí vận chuyển 30,000đ
        const total = subtotal + shipping;

        document.querySelector('.subtotal-amount').textContent = `${subtotal.toLocaleString('vi-VN')}đ`;
        document.querySelector('.shipping-amount').textContent = `${shipping.toLocaleString('vi-VN')}đ`;
        document.querySelector('.total-amount').textContent = `${total.toLocaleString('vi-VN')}đ`;
    }
}

// Hiển thị giỏ hàng
function displayCart() {
    const cart = new Cart();
    const cartItems = cart.getItems();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cartItems.length === 0) {
        // Hiển thị thông báo giỏ hàng trống
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        if (emptyCart) emptyCart.style.display = 'block';
        
        // Ẩn container giỏ hàng
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) cartContainer.style.display = 'none';
        
        return;
    }
    
    // Hiển thị giỏ hàng có sản phẩm
    if (emptyCart) emptyCart.style.display = 'none';
    
    // Hiển thị container giỏ hàng
    const cartContainer = document.querySelector('.cart-container');
    if (cartContainer) cartContainer.style.display = 'block';
    
    // Hiển thị các sản phẩm trong giỏ hàng
    const cartItemsHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItemQuantity('${item.id}', this.value)">
                    <button class="quantity-btn plus-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item-btn" onclick="removeCartItem('${item.id}')">Xóa</button>
            </div>
        </div>
    `).join('');
    
    if (cartItemsContainer) cartItemsContainer.innerHTML = cartItemsHTML;
    
    // Cập nhật tổng tiền
    updateCartSummary();
}

// Cập nhật tổng tiền
function updateCartSummary() {
    const cart = new Cart();
    const subtotal = cart.getTotalPrice();
    const shipping = subtotal > 0 ? 30000 : 0; // Phí vận chuyển 30.000đ nếu có sản phẩm
    const discount = getDiscount();
    const total = subtotal + shipping - discount;
    
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (shippingElement) shippingElement.textContent = formatCurrency(shipping);
    if (discountElement) discountElement.textContent = formatCurrency(discount);
    if (totalElement) totalElement.textContent = formatCurrency(total);
}

// Lấy thông tin giảm giá từ localStorage
function getDiscount() {
    const discountInfo = JSON.parse(localStorage.getItem('discount'));
    return discountInfo ? discountInfo.amount : 0;
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartItemQuantity(productId, newQuantity) {
    const cart = new Cart();
    cart.updateQuantity(productId, newQuantity);
    displayCart();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeCartItem(productId) {
    const cart = new Cart();
    cart.removeItem(productId);
    displayCart();
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Xử lý sự kiện khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo giỏ hàng
    const cart = new Cart();
    
    // Hiển thị giỏ hàng nếu đang ở trang giỏ hàng
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
        
        // Xử lý nút tiếp tục mua sắm
        const continueShoppingBtn = document.getElementById('continueShoppingBtn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function() {
                window.history.back();
            });
        }
        
        // Xử lý nút thanh toán
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.getItemCount() > 0) {
                    window.location.href = 'checkout.html';
                } else {
                    showNotification('Giỏ hàng của bạn đang trống!', 'error');
                }
            });
        }
        
        // Xử lý mã giảm giá
        const applyCouponBtn = document.getElementById('applyCoupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', function() {
                const couponCode = document.getElementById('couponCode').value.trim();
                
                if (couponCode) {
                    // Danh sách mã giảm giá hợp lệ (demo)
                    const validCoupons = {
                        'SALE10': 10,
                        'SALE20': 20,
                        'WELCOME15': 15
                    };
                    
                    if (validCoupons[couponCode]) {
                        // Áp dụng giảm giá
                        const discountPercent = validCoupons[couponCode];
                        const subtotal = cart.getTotalPrice();
                        const discountAmount = subtotal * (discountPercent / 100);
                        
                        // Lưu thông tin giảm giá
                        localStorage.setItem('discount', JSON.stringify({
                            code: couponCode,
                            percent: discountPercent,
                            amount: discountAmount
                        }));
                        
                        // Cập nhật hiển thị
                        updateCartSummary();
                        showNotification(`Đã áp dụng mã giảm giá ${discountPercent}%!`, 'success');
                    } else {
                        showNotification('Mã giảm giá không hợp lệ!', 'error');
                    }
                } else {
                    showNotification('Vui lòng nhập mã giảm giá!', 'error');
                }
            });
        }

        // Xử lý nút thêm vào giỏ
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const product = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image
                };
                addToCart(product);
            });
        });

        // Xử lý nút yêu thích
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', function() {
                const product = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image
                };
                toggleFavorite(product);
            });
        });
    }
});

// Lấy dữ liệu từ localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
        cart[index].quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
}

// Thêm/xóa sản phẩm yêu thích
function toggleFavorite(product) {
    const favorites = getFavorites();
    const index = favorites.findIndex(item => item.id === product.id);
    
    if (index === -1) {
        favorites.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        showNotification(`Đã thêm "${product.name}" vào yêu thích!`, 'success');
    } else {
        favorites.splice(index, 1);
        showNotification(`Đã xóa "${product.name}" khỏi yêu thích!`, 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteCount();
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-badge').forEach(el => el.textContent = count);
}

// Cập nhật số lượng sản phẩm yêu thích
function updateFavoriteCount() {
    const favorites = getFavorites();
    const badge = document.querySelector('.favorite-badge');
    if (badge) {
        badge.textContent = favorites.length;
    }
}

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    // type: 'success', 'error', 'info'
    let icon = '<i class="fas fa-check-circle"></i>';
    if (type === 'error') icon = '<i class="fas fa-times-circle"></i>';
    if (type === 'info') icon = '<i class="fas fa-info-circle"></i>';

    // Tạo container nếu chưa có
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Tạo thông báo
    const noti = document.createElement('div');
    noti.className = `notification ${type}`;
    noti.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(noti);

    // Tự động ẩn sau 2.5s
    setTimeout(() => {
        noti.classList.add('fade-out');
        setTimeout(() => noti.remove(), 300);
    }, 2500);
}

// Hiển thị sản phẩm trong giỏ hàng
function displayCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    
    const cart = getCart();
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Giỏ hàng trống</p>';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartContainer.innerHTML = `
        ${cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Giá: ${item.price.toLocaleString('vi-VN')}đ</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `).join('')}
        <div class="cart-total">
            <h3>Tổng cộng: ${total.toLocaleString('vi-VN')}đ</h3>
            <button class="checkout-btn">Thanh toán</button>
        </div>
    `;
}

// Hiển thị sản phẩm yêu thích
function displayFavorites() {
    const favoritesContainer = document.querySelector('.favorites-container');
    if (!favoritesContainer) return;
    
    const favorites = getFavorites();
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="empty-favorites">Chưa có sản phẩm yêu thích</p>';
        return;
    }
    
    favoritesContainer.innerHTML = `
        ${favorites.map(item => `
            <div class="favorite-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Giá: ${item.price.toLocaleString('vi-VN')}đ</p>
                    <button onclick="addToCart(${JSON.stringify(item)})">Thêm vào giỏ</button>
                    <button onclick="toggleFavorite(${JSON.stringify(item)})">Xóa khỏi yêu thích</button>
                </div>
            </div>
        `).join('')}
    `;
}

// Cập nhật số lượng sản phẩm
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const cart = getCart();
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(newCart));
    displayCart();
    updateCartCount();
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateFavoriteCount();
    
    // Nếu đang ở trang giỏ hàng
    if (document.querySelector('.cart-items')) {
        displayCart();
    }
    
    // Nếu đang ở trang profile
    if (document.querySelector('.favorites-container')) {
        displayFavorites();
    }
});

