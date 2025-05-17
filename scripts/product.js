import { Cart, showNotification, createFlyToCartEffect } from './cart.js';

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo giỏ hàng
    const cart = new Cart();
    
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
                
                // Hiệu ứng bay vào giỏ hàng
                createFlyToCartEffect(productCard);
            }
        }
    });
    
    // Xử lý nút xem nhanh
    const quickViewButtons = document.querySelectorAll('.product-overlay button[title="Xem nhanh"]');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Hiển thị modal xem nhanh
            showQuickViewModal(productTitle, productPrice, productImage);
        });
    });
    
    // Xử lý nút yêu thích
    const wishlistButtons = document.querySelectorAll('.product-overlay button[title="Yêu thích"]');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Thêm hiệu ứng khi click vào nút yêu thích
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#e74c3c';
                showNotification('Đã thêm vào danh sách yêu thích!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                showNotification('Đã xóa khỏi danh sách yêu thích!', 'info');
            }
        });
    });
    
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
    
    // Hàm hiển thị modal xem nhanh
    function showQuickViewModal(title, price, image) {
        // Tạo modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        
        modal.innerHTML = `
            <div class="quick-view-content">
                <button class="close-modal"><i class="fas fa-times"></i></button>
                <div class="product-quick-view">
                    <div class="product-quick-image">
                        <img src="${image}" alt="${title}">
                    </div>
                    <div class="product-quick-details">
                        <h2>${title}</h2>
                        <p class="price">${price}</p>
                        <p class="description">Sản phẩm thời trang cao cấp với chất liệu vải cao cấp, thiết kế hiện đại và sang trọng. Phù hợp cho nhiều dịp khác nhau.</p>
                        <div class="size-options">
                            <p>Kích thước:</p>
                            <div class="size-buttons">
                                <button>S</button>
                                <button>M</button>
                                <button>L</button>
                                <button>XL</button>
                            </div>
                        </div>
                        <div class="quantity-selector">
                            <p>Số lượng:</p>
                            <div class="quantity-buttons">
                                <button class="quantity-decrease">-</button>
                                <input type="number" value="1" min="1" max="10">
                                <button class="quantity-increase">+</button>
                            </div>
                        </div>
                        <button class="add-to-cart-btn">Thêm vào giỏ hàng</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Thêm CSS cho modal
        const style = document.createElement('style');
        style.textContent = `
            .quick-view-modal {
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
            
            .quick-view-content {
                background-color: white;
                border-radius: 8px;
                max-width: 900px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                z-index: 10;
            }
            
            .product-quick-view {
                display: flex;
                flex-wrap: wrap;
            }
            
            .product-quick-image {
                flex: 1;
                min-width: 300px;
                padding: 20px;
            }
            
            .product-quick-image img {
                width: 100%;
                height: auto;
                object-fit: cover;
            }
            
            .product-quick-details {
                flex: 1;
                min-width: 300px;
                padding: 30px;
            }
            
            .product-quick-details h2 {
                margin-bottom: 10px;
                font-size: 24px;
            }
            
            .product-quick-details .price {
                font-size: 22px;
                font-weight: bold;
                color: #e74c3c;
                margin-bottom: 15px;
            }
            
            .product-quick-details .description {
                margin-bottom: 20px;
                line-height: 1.6;
            }
            
            .size-options, .quantity-selector {
                margin-bottom: 20px;
            }
            
            .size-buttons {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            
            .size-buttons button {
                width: 40px;
                height: 40px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .size-buttons button:hover {
                border-color: #e74c3c;
                color: #e74c3c;
            }
            
            .quantity-buttons {
                display: flex;
                align-items: center;
                margin-top: 10px;
            }
            
            .quantity-buttons button {
                width: 30px;
                height: 30px;
                border: 1px solid #ddd;
                background: white;
                cursor: pointer;
            }
            
            .quantity-buttons input {
                width: 50px;
                height: 30px;
                text-align: center;
                border: 1px solid #ddd;
                border-left: none;
                border-right: none;
            }
            
            .add-to-cart-btn {
                background-color: #e74c3c;
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s;
            }
            
            .add-to-cart-btn:hover {
                background-color: #c0392b;
            }
            
            @media (max-width: 768px) {
                .product-quick-view {
                    flex-direction: column;
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
        
        // Xử lý nút thêm vào giỏ hàng trong modal
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            
            // Thêm sản phẩm vào giỏ hàng với số lượng từ modal
            const productId = Math.floor(Math.random() * 1000); // Tạo ID ngẫu nhiên cho demo
            
            const added = cart.addItem({
                id: productId,
                name: title,
                currentPrice: parseFloat(price.replace(/[^\d]/g, '')),
                image: image,
                quantity: quantity
            });
            
            if (added) {
                showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            } else {
                showNotification('Sản phẩm đã có trong giỏ hàng!', 'info');
            }
            
            // Đóng modal
            modal.remove();
            style.remove();
        });
    }
});

// Hiệu ứng bay vào giỏ hàng
function createFlyToCartEffect(productElement) {
    // Tạo phần tử ảnh bay
    const flyingImg = document.createElement('img');
    const productImg = productElement.querySelector('img');
    
    // Lấy vị trí của sản phẩm và giỏ hàng
    const productRect = productImg.getBoundingClientRect();
    const cartIcon = document.querySelector('.cart-icon') || document.querySelector('.icon-btn[title="Giỏ hàng"]');
    
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


