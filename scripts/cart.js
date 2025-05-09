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
    // Xử lý sự kiện click vào nút thêm vào giỏ hàng
    document.addEventListener('click', function(e) {
        if (e.target.closest('.product-overlay button:nth-child(2)')) {
            const productCard = e.target.closest('.product-card');
            
            if (productCard) {
                // Lấy thông tin sản phẩm
                const productId = parseInt(productCard.dataset.id);
                const productName = productCard.querySelector('.product-title').textContent;
                const productPrice = parseFloat(productCard.dataset.price);
                const productImage = productCard.querySelector('.product-image img').src;
                
                // Tạo đối tượng sản phẩm
                const product = {
                    id: productId,
                    name: productName,
                    currentPrice: productPrice,
                    image: productImage
                };
                
                // Thêm vào giỏ hàng
                cart.addItem(product);
                
                // Hiển thị thông báo
                showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            }
        }
    });
});

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
    
    // Icon tùy theo loại thông báo
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

// Thêm hàm hiển thị modal xem nhanh sản phẩm
function showQuickViewModal(productId, productTitle, productPrice, productImage) {
    // Tạo modal
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    
    // Nội dung modal
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-product">
                <div class="modal-product-image">
                    <img src="${productImage}" alt="${productTitle}">
                </div>
                <div class="modal-product-details">
                    <h2>${productTitle}</h2>
                    <div class="modal-product-price">${productPrice}</div>
                    <div class="product-description">
                        <p>Mô tả sản phẩm sẽ được hiển thị ở đây. Thông tin chi tiết về chất liệu, kiểu dáng và hướng dẫn sử dụng.</p>
                    </div>
                    <div class="product-options">
                        <div class="size-options">
                            <h4>Kích thước:</h4>
                            <div class="size-buttons">
                                <button class="size-button">S</button>
                                <button class="size-button">M</button>
                                <button class="size-button">L</button>
                                <button class="size-button">XL</button>
                            </div>
                        </div>
                        <div class="color-options">
                            <h4>Màu sắc:</h4>
                            <div class="color-buttons">
                                <button class="color-button" style="background-color: #000;"></button>
                                <button class="color-button" style="background-color: #fff; border: 1px solid #ddd;"></button>
                                <button class="color-button" style="background-color: #0066cc;"></button>
                                <button class="color-button" style="background-color: #cc0000;"></button>
                            </div>
                        </div>
                    </div>
                    <div class="quantity-selector">
                        <h4>Số lượng:</h4>
                        <div class="quantity-buttons">
                            <button class="quantity-decrease">-</button>
                            <input type="number" value="1" min="1" max="10">
                            <button class="quantity-increase">+</button>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="add-to-cart-btn">Thêm vào giỏ hàng</button>
                        <button class="buy-now-btn">Mua ngay</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Thêm modal vào body
    document.body.appendChild(modal);
    
    // Thêm style cho modal
    const style = document.createElement('style');
    style.textContent = `
        .product-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-content {
            background-color: white;
            width: 90%;
            max-width: 1000px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 8px;
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 28px;
            cursor: pointer;
            z-index: 10;
        }
        
        .modal-product {
            display: flex;
            flex-wrap: wrap;
        }
        
        .modal-product-image {
            flex: 1;
            min-width: 300px;
            padding: 20px;
        }
        
        .modal-product-image img {
            width: 100%;
            height: auto;
            object-fit: cover;
        }
        
        .modal-product-details {
            flex: 1;
            min-width: 300px;
            padding: 30px;
        }
        
        .modal-product-price {
            font-size: 24px;
            font-weight: bold;
            color: #fd7e14;
            margin: 15px 0;
        }
        
        .product-description {
            margin: 20px 0;
            line-height: 1.6;
        }
        
        .product-options {
            margin: 20px 0;
        }
        
        .size-options, .color-options {
            margin-bottom: 15px;
        }
        
        .size-buttons, .color-buttons {
            display: flex;
            gap: 10px;
            margin-top: 8px;
        }
        
        .size-button {
            width: 40px;
            height: 40px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .size-button:hover {
            border-color: #fd7e14;
        }
        
        .color-button {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .color-button:hover {
            transform: scale(1.1);
        }
        
        .quantity-selector {
            margin: 20px 0;
        }
        
        .quantity-buttons {
            display: flex;
            align-items: center;
            margin-top: 8px;
        }
        
        .quantity-buttons input {
            width: 50px;
            height: 40px;
            text-align: center;
            border: 1px solid #ddd;
            margin: 0 10px;
        }
        
        .quantity-decrease, .quantity-increase {
            width: 40px;
            height: 40px;
            background: white;
            border: 1px solid #ddd;
            cursor: pointer;
        }
        
        .modal-actions {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .add-to-cart-btn, .buy-now-btn {
            padding: 12px 25px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .add-to-cart-btn {
            background-color: white;
            color: #fd7e14;
            border: 2px solid #fd7e14;
        }
        
        .add-to-cart-btn:hover {
            background-color: #fd7e14;
            color: white;
        }
        
        .buy-now-btn {
            background-color: #fd7e14;
            color: white;
        }
        
        .buy-now-btn:hover {
            background-color: #e8710a;
        }
        
        @media (max-width: 768px) {
            .modal-product {
                flex-direction: column;
            }
            
            .modal-product-image, .modal-product-details {
                min-width: 100%;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Xử lý đóng modal
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
        modal.remove();
        style.remove();
    });
    
    // Xử lý click bên ngoài để đóng modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
    
    // Xử lý nút tăng giảm số lượng
    const decreaseBtn = modal.querySelector('.quantity-decrease');
    const increaseBtn = modal.querySelector('.quantity-increase');
    const quantityInput = modal.querySelector('.quantity-buttons input');
    
    decreaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });

    // Xử lý nút thêm vào giỏ hàng
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        const selectedSize = modal.querySelector('.size-button.selected')?.textContent || 'M';
        const selectedColor = modal.querySelector('.color-button.selected')?.style.backgroundColor || '#000';
        
        // Tạo đối tượng sản phẩm
        const product = {
            id: productId,
            name: productTitle,
            currentPrice: parseFloat(productPrice.replace(/[^\d]/g, '')),
            image: productImage,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity
        };
        
        // Thêm vào giỏ hàng
        cart.addItem(product, quantity);
        
        // Hiển thị thông báo
        showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
        
        // Đóng modal
        modal.remove();
        style.remove();
    });

    // Xử lý nút mua ngay
    const buyNowBtn = modal.querySelector('.buy-now-btn');
    buyNowBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        const selectedSize = modal.querySelector('.size-button.selected')?.textContent || 'M';
        const selectedColor = modal.querySelector('.color-button.selected')?.style.backgroundColor || '#000';
        
        // Tạo đối tượng sản phẩm
        const product = {
            id: productId,
            name: productTitle,
            currentPrice: parseFloat(productPrice.replace(/[^\d]/g, '')),
            image: productImage,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity
        };
        
        // Thêm vào giỏ hàng
        cart.addItem(product, quantity);
        
        // Chuyển đến trang thanh toán
        window.location.href = 'checkout.html';
    });

    // Xử lý chọn kích thước
    const sizeButtons = modal.querySelectorAll('.size-button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Xử lý chọn màu sắc
    const colorButtons = modal.querySelectorAll('.color-button');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

