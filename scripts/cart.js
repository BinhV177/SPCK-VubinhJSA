class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }
    
    // Thêm sản phẩm vào giỏ hàng
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        
        return true;
    }
    
    // Cập nhật số lượng sản phẩm
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            item.quantity = quantity;
            
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
            }
            
            return true;
        }
        
        return false;
    }
    
    // Xóa sản phẩm khỏi giỏ hàng
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        
        return true;
    }
    
    // Lấy tất cả sản phẩm trong giỏ hàng
    getItems() {
        return this.items;
    }
    
    // Tính tổng tiền
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);
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
        this.updateCartCount();
    }
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = this.getItemCount();
        }
    }
}

// Khởi tạo giỏ hàng
const cart = new Cart();

// Xử lý sự kiện thêm vào giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý tất cả các nút thêm vào giỏ hàng (bao gồm cả nút biểu tượng)
    document.addEventListener('click', function(e) {
        // Kiểm tra nếu click vào nút giỏ hàng (cả nút text và nút icon)
        const cartButton = e.target.closest('button[title="Thêm vào giỏ hàng"]') || 
                          e.target.closest('.cart-icon-btn') ||
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
            const added = cart.addItem({
                id: productId,
                name: productTitle,
                currentPrice: productPrice,
                image: productImage,
                quantity: 1
            });
            
            if (added) {
                // Hiển thị thông báo thành công
                showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
                
                // Thêm hiệu ứng animation cho nút
                cartButton.classList.add('adding');
                setTimeout(() => {
                    cartButton.classList.remove('adding');
                }, 700);
                
                // Hiệu ứng bay vào giỏ hàng
                createFlyToCartEffect(productCard);
            }
        }
    });
});

// Hiệu ứng bay vào giỏ hàng
function createFlyToCartEffect(productElement) {
    // Tạo phần tử ảnh bay
    const flyingImg = document.createElement('img');
    const productImg = productElement.querySelector('img');
    
    // Lấy vị trí của sản phẩm và giỏ hàng
    const productRect = productImg.getBoundingClientRect();
    const cartIcon = document.querySelector('.icon-btn[title="Giỏ hàng"]') || document.querySelector('.cart-icon');
    
    if (!cartIcon) return;
    
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Thiết lập style cho ảnh bay
    flyingImg.src = productImg.src;
    flyingImg.style.position = 'fixed';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.width = '50px';
    flyingImg.style.height = '50px';
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.borderRadius = '50%';
    flyingImg.style.left = `${productRect.left + productRect.width / 2 - 25}px`;
    flyingImg.style.top = `${productRect.top + productRect.height / 2 - 25}px`;
    flyingImg.style.opacity = '0.8';
    flyingImg.style.pointerEvents = 'none';
    
    // Thêm vào body
    document.body.appendChild(flyingImg);
    
    // Tạo animation
    const keyframes = [
        { 
            transform: 'scale(1)', 
            left: `${productRect.left + productRect.width / 2 - 25}px`,
            top: `${productRect.top + productRect.height / 2 - 25}px`,
            opacity: 0.8
        },
        { 
            transform: 'scale(0.8)', 
            left: `${productRect.left + productRect.width / 2 - 20}px`,
            top: `${productRect.top + productRect.height / 2 - 100}px`,
            opacity: 0.9
        },
        { 
            transform: 'scale(0.6)', 
            left: `${cartRect.left + cartRect.width / 2 - 15}px`,
            top: `${cartRect.top + cartRect.height / 2 - 15}px`,
            opacity: 0.2
        }
    ];
    
    const options = {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
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

// Thêm hàm hiển thị thông báo
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



