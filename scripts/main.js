import cartManager, { addToCart, updateCartCount } from './cart-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật số lượng giỏ hàng khi trang tải
    updateCartCount();
    
    // Xử lý tất cả các nút thêm vào giỏ hàng
    document.addEventListener('click', function(e) {
        // Kiểm tra nếu click vào nút giỏ hàng
        const addToCartButton = e.target.closest('.add-to-cart-btn') || 
                               e.target.closest('button[title="Thêm vào giỏ hàng"]') ||
                               e.target.closest('.cart-icon-btn');
        
        if (addToCartButton) {
            e.preventDefault();
            
            // Lấy thông tin sản phẩm
            const productCard = addToCartButton.closest('.product-card') || 
                               addToCartButton.closest('.product-item') ||
                               addToCartButton.closest('.product-detail');
            
            if (productCard) {
                // Lấy thông tin sản phẩm
                const productId = productCard.getAttribute('data-id');
                const productName = productCard.querySelector('.product-title').textContent;
                const priceElement = productCard.querySelector('.current-price');
                
                if (!productId || !productName || !priceElement) {
                    console.error('Không tìm thấy đủ thông tin sản phẩm');
                    return;
                }
                
                const priceText = priceElement.textContent;
                const productPrice = parseFloat(priceText.replace(/[^\d]/g, ''));
                const productImage = productCard.querySelector('.product-image img').src;
                
                // Thêm vào giỏ hàng
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                
                // Thêm sản phẩm vào giỏ hàng
                if (addToCart(product)) {
                    alert('Đã thêm sản phẩm vào giỏ hàng!');
                }
            } else {
                console.error('Không tìm thấy thông tin sản phẩm');
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
    if (!product || !product.id || !product.name || !product.price) {
        console.error('Thông tin sản phẩm không hợp lệ:', product);
        return false;
    }
    
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingProductIndex].quantity += 1;
        console.log('Tăng số lượng sản phẩm trong giỏ hàng:', cart[existingProductIndex]);
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
        console.log('Thêm sản phẩm mới vào giỏ hàng');
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Đã lưu giỏ hàng vào localStorage:', cart);
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount();
    
    return true;
}

// Thêm vào giỏ hàng và chuyển hướng đến trang giỏ hàng
function addToCartAndRedirect(product) {
    // Thêm sản phẩm vào giỏ hàng
    addToCart(product);
    
    // Chuyển hướng đến trang giỏ hàng với tham số thông báo
    window.location.href = 'cart.html?added=true';
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Tính tổng số lượng
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('Tổng số lượng sản phẩm trong giỏ hàng:', count);
    
    // Cập nhật số lượng hiển thị
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
        console.log('Đã cập nhật badge giỏ hàng:', count);
    });
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
            updateCartCount();
            
            // Xóa phần tử bay và hiệu ứng nhấp nháy
            setTimeout(() => {
                flyingItem.remove();
                cartIcon.classList.remove('cart-pulse');
            }, 500);
        }, 800);
    }, 10);
}

// Export các hàm để sử dụng ở các file khác

