import { Cart } from './cart.js';

document.addEventListener('DOMContentLoaded', function() {
    const cart = new Cart();
    
    // Xử lý thêm sản phẩm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll('.product-overlay button[title="Thêm vào giỏ hàng"]');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.dataset.price);
            const productImage = productCard.querySelector('.product-image img').src;
            
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
            } else {
                // Hiển thị thông báo đã có trong giỏ hàng
                showNotification('Sản phẩm đã có trong giỏ hàng!', 'info');
            }
        });
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
    function showNotification(message, type) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = '';
        if (type === 'success') {
            icon = '<i class="fas fa-check-circle"></i>';
        } else if (type === 'error') {
            icon = '<i class="fas fa-exclamation-circle"></i>';
        } else if (type === 'info') {
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
