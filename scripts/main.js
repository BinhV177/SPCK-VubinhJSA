import { cartManager, showNotification, createFlyToCartEffect } from './cart-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật số lượng giỏ hàng khi trang tải
    cartManager.updateCartCount();
    
    // Xử lý tất cả các nút thêm vào giỏ hàng
    document.body.addEventListener('click', function(event) {
        const target = event.target;

        // Xử lý nút "Thêm vào giỏ hàng" (Bắt click trên icon hoặc nút)
        const addToCartButton = target.closest('.add-to-cart-btn') ||
                                target.closest('button[title="Thêm vào giỏ hàng"]') ||
                                target.closest('.cart-icon-btn') ||
                                (target.tagName === 'I' && target.classList.contains('fa-shopping-cart'));

        if (addToCartButton) {
            event.preventDefault();

            // Tìm thẻ sản phẩm gần nhất có data-id
            const productCard = addToCartButton.closest('.product-card') || addToCartButton.closest('[data-id]');
            if (!productCard) {
                console.error('Không tìm thấy thông tin sản phẩm để thêm vào giỏ hàng.');
                return;
            }

            // Lấy thông tin sản phẩm
            const productId = productCard.getAttribute('data-id');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.getAttribute('data-price') || 
                                           productCard.querySelector('.current-price').textContent.replace(/[^\d]/g, ''));
            const productImage = productCard.querySelector('img').src;

            // Thêm vào giỏ hàng
            addToCart({
                id: productId,
                name: productTitle,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            
            // Hiệu ứng và thông báo
            showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            
            // Cập nhật số lượng giỏ hàng
            updateCartCount();
            
            // Tạo hiệu ứng bay vào giỏ hàng nếu có
            if (typeof createFlyToCartEffect === 'function') {
                const imgElement = productCard.querySelector('img');
                if (imgElement) {
                    createFlyToCartEffect(imgElement);
                }
            }
        }
    });
    
    // Xử lý nút yêu thích
    document.body.addEventListener('click', function(event) {
        const wishlistButton = event.target.closest('.wishlist-btn') || 
                              event.target.closest('button[title="Yêu thích"]');
        
        if (wishlistButton) {
            event.preventDefault();
            
            const heartIcon = wishlistButton.querySelector('i');
            
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartIcon.style.color = '#e74c3c';
                showNotification('Đã thêm vào danh sách yêu thích!', 'success');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartIcon.style.color = '';
                showNotification('Đã xóa khỏi danh sách yêu thích!', 'info');
            }
        }
    });
});

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push(product);
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return true;
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) return;
    
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Tính tổng số lượng
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Cập nhật số lượng hiển thị
    cartBadge.textContent = count;
    
    // Hiển thị hoặc ẩn badge dựa vào số lượng
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
}

// Export các hàm để sử dụng ở các file khác

