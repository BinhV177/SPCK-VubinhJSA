import { Cart } from './cart.js';

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
            
            // Lấy thông tin sản phẩm
            const productCard = cartButton.closest('.product-card') || 
                               cartButton.closest('.product-item') ||
                               cartButton.closest('.product-detail');
            
            if (productCard) {
                // Lấy thông tin sản phẩm
                const productId = productCard.getAttribute('data-id');
                const productName = productCard.querySelector('.product-title').textContent;
                const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace(/[^\d]/g, ''));
                const productImage = productCard.querySelector('.product-image img').src;
                
                // Kiểm tra dữ liệu hợp lệ
                if (productId && productName && productPrice && productImage) {
                    // Thêm vào giỏ hàng
                    const product = {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    };
                    
                    // Thêm sản phẩm vào giỏ hàng
                    addToCart(product);
                    
                    // Tạo hiệu ứng bay vào giỏ hàng
                    const cartIcon = document.querySelector('.cart-icon') || document.querySelector('.icon-btn[title="Giỏ hàng"]');
                    if (cartIcon) {
                        createFlyToCartEffect(productCard, cartIcon);
                    }
                    
                    console.log('Đã thêm sản phẩm vào giỏ hàng:', product);
                } else {
                    console.error('Thiếu thông tin sản phẩm:', { productId, productName, productPrice, productImage });
                }
            }
        }
    });
});

// Xử lý nút thêm vào giỏ hàng trong trang chi tiết sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    console.log('Trang chi tiết sản phẩm đã tải xong');
    
    // Lấy nút thêm vào giỏ hàng
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (addToCartBtn) {
        console.log('Đã tìm thấy nút thêm vào giỏ hàng');
        
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Đã nhấn nút thêm vào giỏ hàng');
            
            // Lấy thông tin sản phẩm
            const productDetail = document.querySelector('.product-detail');
            
            if (productDetail) {
                const productId = productDetail.getAttribute('data-id');
                const productName = productDetail.querySelector('.product-title').textContent;
                const priceText = productDetail.querySelector('.current-price').textContent;
                const productPrice = parseFloat(priceText.replace(/[^\d]/g, ''));
                const productImage = productDetail.querySelector('.product-image img').src;
                
                console.log('Thông tin sản phẩm:', {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                
                // Lấy số lượng từ input (nếu có)
                const quantityInput = document.querySelector('.quantity-input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                // Thêm vào giỏ hàng
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                };
                
                // Thêm sản phẩm vào giỏ hàng
                addToCart(product);
                
                // Tạo hiệu ứng bay vào giỏ hàng
                const cartIcon = document.querySelector('.cart-icon') || 
                                document.querySelector('.icon-btn[title="Giỏ hàng"]');
                
                if (cartIcon && productDetail) {
                    createFlyToCartEffect(productDetail, cartIcon);
                }
                
                // Hiển thị thông báo
                alert('Đã thêm sản phẩm vào giỏ hàng!');
            } else {
                console.error('Không tìm thấy thông tin sản phẩm');
            }
        });
    }
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
        cart[existingProductIndex].quantity += product.quantity || 1;
        console.log('Tăng số lượng sản phẩm trong giỏ hàng:', cart[existingProductIndex]);
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity || 1
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



