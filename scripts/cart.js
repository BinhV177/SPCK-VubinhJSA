export class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart') || '[]');
        this.updateCartCount();
    }

    addItem(product) {
        // Kiểm tra dữ liệu sản phẩm
        if (!product || !product.id || !product.name || !product.currentPrice) {
            console.error('Dữ liệu sản phẩm không hợp lệ:', product);
            return false;
        }

        // Tìm sản phẩm trong giỏ hàng
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            existingItem.quantity += product.quantity || 1;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm mới
            this.items.push({
                id: product.id,
                name: product.name,
                currentPrice: product.currentPrice,
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        // Lưu giỏ hàng vào localStorage
        this.saveCart();
        
        // Cập nhật số lượng hiển thị
        this.updateCartCount();
        
        return true;
    }

    removeItem(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            this.saveCart();
            this.updateCartCount();
            return removedItem;
        }
        
        return null;
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            const newQty = parseInt(quantity);
            
            if (!isNaN(newQty) && newQty > 0) {
                item.quantity = newQty;
                this.saveCart();
                this.updateCartCount();
                return true;
            } else if (newQty <= 0) {
                return this.removeItem(productId);
            }
        }
        
        return false;
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);
    }

    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const count = this.getCount();
        const cartBadges = document.querySelectorAll('.cart-badge');
        
        cartBadges.forEach(badge => {
            badge.textContent = count;
            
            // Hiển thị hoặc ẩn badge dựa vào số lượng
            if (count > 0) {
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    }
}

// Hàm hiển thị thông báo thêm vào giỏ hàng thành công
export function showNotification(message, type = 'success') {
    // Tạo container nếu chưa tồn tại
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon dựa vào loại thông báo
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-bell"></i>';
    }
    
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Hiệu ứng hiển thị
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            notification.remove();
            
            // Xóa container nếu không còn thông báo
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}

// Hiệu ứng bay vào giỏ hàng
export function createFlyToCartEffect(productElement) {
    // Tạo phần tử ảnh bay
    const flyingImg = document.createElement('img');
    const productImg = productElement.querySelector('img');
    
    if (!productImg) return;
    
    // Lấy vị trí của sản phẩm và giỏ hàng
    const productRect = productImg.getBoundingClientRect();
    const cartIcon = document.querySelector('.cart-icon') || document.querySelector('.icon-btn[title="Giỏ hàng"]');
    
    if (!cartIcon) return;
    
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Thiết lập ảnh bay
    flyingImg.src = productImg.src;
    flyingImg.style.position = 'fixed';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.width = '50px';
    flyingImg.style.height = '50px';
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.borderRadius = '50%';
    flyingImg.style.top = `${productRect.top}px`;
    flyingImg.style.left = `${productRect.left}px`;
    flyingImg.style.opacity = '1';
    flyingImg.style.pointerEvents = 'none';
    
    document.body.appendChild(flyingImg);
    
    // Thiết lập animation
    const keyframes = [
        {
            top: `${productRect.top}px`,
            left: `${productRect.left}px`,
            opacity: 1,
            transform: 'scale(1)'
        },
        {
            top: `${productRect.top - 50}px`,
            left: `${productRect.left + 50}px`,
            opacity: 0.8,
            transform: 'scale(0.8)'
        },
        {
            top: `${cartRect.top}px`,
            left: `${cartRect.left}px`,
            opacity: 0.5,
            transform: 'scale(0.5)'
        }
    ];
    
    const options = {
        duration: 800,
        easing: 'ease-in-out'
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

// Các hàm liên quan đến wishlist đã được xóa.

document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị sản phẩm trong giỏ hàng
    displayCartItems();
    
    // Cập nhật tổng tiền
    updateCartTotal();
    
    // Xử lý sự kiện xóa sản phẩm
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const cartItem = e.target.closest('.cart-item');
            const productId = cartItem.getAttribute('data-id');
            
            // Xóa sản phẩm khỏi giỏ hàng
            removeCartItem(productId);
            
            // Cập nhật hiển thị
            displayCartItems();
            updateCartTotal();
            updateCartCount();
            
            // Hiển thị thông báo
            showNotification('Đã xóa sản phẩm khỏi giỏ hàng!', 'info');
        }
    });
    
    // Xử lý sự kiện thay đổi số lượng
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const cartItem = e.target.closest('.cart-item');
            const productId = cartItem.getAttribute('data-id');
            const quantityInput = cartItem.querySelector('.quantity-input');
            let quantity = parseInt(quantityInput.value);
            
            if (e.target.classList.contains('decrease-btn')) {
                quantity = Math.max(1, quantity - 1);
            } else if (e.target.classList.contains('increase-btn')) {
                quantity = Math.min(10, quantity + 1);
            }
            
            // Cập nhật số lượng
            quantityInput.value = quantity;
            updateCartItemQuantity(productId, quantity);
            
            // Cập nhật hiển thị
            updateCartItemSubtotal(cartItem, quantity);
            updateCartTotal();
            updateCartCount();
        }
    });
    
    // Xử lý sự kiện nhập số lượng
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const cartItem = e.target.closest('.cart-item');
            const productId = cartItem.getAttribute('data-id');
            let quantity = parseInt(e.target.value);
            
            // Đảm bảo số lượng hợp lệ
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
            } else if (quantity > 10) {
                quantity = 10;
            }
            
            // Cập nhật số lượng
            e.target.value = quantity;
            updateCartItemQuantity(productId, quantity);
            
            // Cập nhật hiển thị
            updateCartItemSubtotal(cartItem, quantity);
            updateCartTotal();
            updateCartCount();
        }
    });
    
    // Xử lý nút thanh toán
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Kiểm tra xem có sản phẩm trong giỏ hàng không
            const cart = getCart();
            
            if (cart.length === 0) {
                showNotification('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng!', 'error');
                return;
            }
            
            // Chuyển đến trang thanh toán
            window.location.href = 'checkout.html';
        });
    }
    
    // Xử lý nút xóa tất cả
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            // Xóa tất cả sản phẩm trong giỏ hàng
            clearCart();
            
            // Cập nhật hiển thị
            displayCartItems();
            updateCartTotal();
            updateCartCount();
            
            // Hiển thị thông báo
            showNotification('Đã xóa tất cả sản phẩm khỏi giỏ hàng!', 'info');
        });
    }
});

// Hiển thị sản phẩm trong giỏ hàng
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer) return;
    
    // Lấy giỏ hàng từ localStorage
    const cart = getCart();
    
    // Kiểm tra xem giỏ hàng có trống không
    if (cart.length === 0) {
        // Hiển thị thông báo giỏ hàng trống
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'flex';
        }
        
        // Ẩn phần tổng tiền
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        
        // Xóa các sản phẩm hiện có
        cartItemsContainer.innerHTML = '';
        
        // Thêm thông báo giỏ hàng trống nếu chưa có
        if (!emptyCartMessage) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h3>Giỏ hàng trống</h3>
                    <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                    <a href="index.html" class="continue-shopping-btn">
                        <i class="fas fa-arrow-left"></i>
                        Tiếp tục mua sắm
                    </a>
                </div>
            `;
        }
        
        return;
    }
    
    // Ẩn thông báo giỏ hàng trống
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }
    
    // Hiển thị phần tổng tiền
    if (cartSummary) {
        cartSummary.style.display = 'block';
    }
    
    // Hiển thị sản phẩm trong giỏ hàng
    let cartItemsHTML = '';
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        
        cartItemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">${formatPrice(item.price)}₫</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                        <button class="quantity-btn increase-btn">+</button>
                    </div>
                </div>
                <div class="cart-item-subtotal">
                    <span>${formatPrice(subtotal)}₫</span>
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartItemsHTML;
}

// Cập nhật tổng tiền
function updateCartTotal() {
    const cartTotalElement = document.getElementById('cartTotal');
    if (!cartTotalElement) return;
    
    // Lấy giỏ hàng từ localStorage
    const cart = getCart();
    
    // Tính tổng tiền
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Hiển thị tổng tiền
    cartTotalElement.textContent = formatPrice(total) + '₫';
}

// Cập nhật thành tiền của một sản phẩm
function updateCartItemSubtotal(cartItem, quantity) {
    const subtotalElement = cartItem.querySelector('.cart-item-subtotal span');
    const priceText = cartItem.querySelector('.cart-item-price').textContent;
    const price = parseFloat(priceText.replace(/[^\d]/g, ''));
    
    const subtotal = price * quantity;
    subtotalElement.textContent = formatPrice(subtotal) + '₫';
}

// Lấy giỏ hàng từ localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Xóa sản phẩm khỏi giỏ hàng
function removeCartItem(productId) {
    let cart = getCart();
    
    // Lọc bỏ sản phẩm cần xóa
    cart = cart.filter(item => item.id !== productId);
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cập nhật số lượng sản phẩm
function updateCartItemQuantity(productId, quantity) {
    let cart = getCart();
    
    // Tìm sản phẩm cần cập nhật
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        // Cập nhật số lượng
        cart[itemIndex].quantity = quantity;
        
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// Xóa tất cả sản phẩm trong giỏ hàng
function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) return;
    
    // Lấy giỏ hàng từ localStorage
    const cart = getCart();
    
    // Tính tổng số lượng
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Cập nhật số lượng hiển thị
    cartBadge.textContent = count;
    
    // Hiển thị hoặc ẩn badge dựa vào số lượng
    if (count > 0) {
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    // Tạo container nếu chưa tồn tại
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Thêm thông báo vào container
    container.appendChild(notification);
    
    // Xử lý nút đóng
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.remove();
    });
    
    // Tự động đóng sau 3 giây
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

