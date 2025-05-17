// Quản lý giỏ hàng
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    // Thêm sản phẩm vào giỏ hàng
    addItem(item) {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = this.cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex !== -1) {
            // Nếu đã có, tăng số lượng
            this.cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Nếu chưa có, thêm mới
            this.cart.push(item);
        }
        
        // Lưu giỏ hàng vào localStorage
        this.saveCart();
        
        // Cập nhật số lượng hiển thị
        this.updateCartCount();
        
        return true;
    }
    
    // Xóa sản phẩm khỏi giỏ hàng
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
    }
    
    // Cập nhật số lượng sản phẩm
    updateItemQuantity(itemId, quantity) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            if (quantity <= 0) {
                // Nếu số lượng <= 0, xóa sản phẩm
                this.removeItem(itemId);
            } else {
                // Cập nhật số lượng
                this.cart[itemIndex].quantity = quantity;
                this.saveCart();
            }
        }
    }
    
    // Lấy tất cả sản phẩm trong giỏ hàng
    getItems() {
        return this.cart;
    }
    
    // Tính tổng tiền
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);
    }
    
    // Tính tổng số lượng sản phẩm
    getTotalQuantity() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Lưu giỏ hàng vào localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    // Xóa giỏ hàng
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            const totalQuantity = this.getTotalQuantity();
            cartBadge.textContent = totalQuantity;
            
            // Hiển thị hoặc ẩn badge tùy thuộc vào số lượng
            if (totalQuantity > 0) {
                cartBadge.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
            }
        }
    }
}

// Tạo instance của CartManager
const cartManager = new CartManager();

// Hàm hiển thị thông báo
function showNotification(message, type = 'info') {
    // Tạo container nếu chưa có
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
    
    // Hiển thị thông báo
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Hàm tạo hiệu ứng bay vào giỏ hàng
function createFlyToCartEffect(productElement) {
    // Lấy vị trí của sản phẩm
    const productRect = productElement.getBoundingClientRect();
    
    // Lấy vị trí của icon giỏ hàng
    const cartIcon = document.querySelector('.fa-shopping-cart');
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Tạo phần tử bay
    const flyItem = document.createElement('div');
    flyItem.className = 'fly-item';
    flyItem.style.cssText = `
        position: fixed;
        z-index: 9999;
        width: 30px;
        height: 30px;
        background-color: #e74c3c;
        border-radius: 50%;
        top: ${productRect.top + productRect.height/2}px;
        left: ${productRect.left + productRect.width/2}px;
        opacity: 0.8;
        transition: all 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    `;
    
    document.body.appendChild(flyItem);
    
    // Tạo hiệu ứng bay
    setTimeout(() => {
        flyItem.style.top = `${cartRect.top + cartRect.height/2}px`;
        flyItem.style.left = `${cartRect.left + cartRect.width/2}px`;
        flyItem.style.opacity = '0';
        flyItem.style.transform = 'scale(0.1)';
        
        // Hiệu ứng nhấp nháy giỏ hàng
        setTimeout(() => {
            cartIcon.classList.add('cart-pulse');
            setTimeout(() => {
                cartIcon.classList.remove('cart-pulse');
            }, 500);
            
            // Xóa phần tử bay
            flyItem.remove();
        }, 800);
    }, 10);
}

export { cartManager, showNotification, createFlyToCartEffect };

// Thêm hàm hiển thị sản phẩm trong giỏ hàng
export function displayCartItems() {
  const cartItemsContainer = document.querySelector('.cart-items');
  if (!cartItemsContainer) return;
  
  // Lấy giỏ hàng từ localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Kiểm tra giỏ hàng trống
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart empty-cart-icon"></i>
        <p>Giỏ hàng của bạn đang trống</p>
        <a href="index.html" class="continue-shopping">Tiếp tục mua sắm</a>
      </div>
    `;
    document.querySelector('.cart-summary').style.display = 'none';
    return;
  }
  
  // Hiển thị sản phẩm
  document.querySelector('.cart-summary').style.display = 'block';
  let cartHTML = '';
  let totalPrice = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    
    cartHTML += `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="item-price">${formatPrice(item.price)}₫</p>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease">-</button>
          <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input">
          <button class="quantity-btn increase">+</button>
        </div>
        <div class="cart-item-total">${formatPrice(itemTotal)}₫</div>
        <button class="remove-item"><i class="fas fa-trash"></i></button>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = cartHTML;
  document.getElementById('subtotal').textContent = formatPrice(totalPrice) + '₫';
  document.getElementById('total').textContent = formatPrice(totalPrice) + '₫';
  
  // Thêm sự kiện cho các nút
  setupCartEvents();
}

// Định dạng giá tiền
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price);
}

// Thiết lập sự kiện cho giỏ hàng
function setupCartEvents() {
  // Xử lý nút tăng/giảm số lượng
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('.quantity-input');
      let value = parseInt(input.value);
      
      if (this.classList.contains('decrease')) {
        value = Math.max(1, value - 1);
      } else {
        value = Math.min(10, value + 1);
      }
      
      input.value = value;
      updateCartItem(this.closest('.cart-item'), value);
    });
  });
  
  // Xử lý thay đổi input số lượng
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', function() {
      let value = parseInt(this.value);
      if (isNaN(value) || value < 1) value = 1;
      if (value > 10) value = 10;
      this.value = value;
      
      updateCartItem(this.closest('.cart-item'), value);
    });
  });
  
  // Xử lý nút xóa sản phẩm
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.cart-item');
      const id = item.getAttribute('data-id');
      removeFromCart(id);
      item.remove();
      updateCartSummary();
      cartManager.updateCartCount();
      showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    });
  });
  
  // Xử lý nút thanh toán
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
        showNotification('Giỏ hàng trống, vui lòng thêm sản phẩm', 'error');
      } else {
        window.location.href = 'checkout.html';
      }
    });
  }
}

// Cập nhật sản phẩm trong giỏ hàng
function updateCartItem(cartItem, quantity) {
  const id = cartItem.getAttribute('data-id');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const itemIndex = cart.findIndex(item => item.id == id);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật hiển thị
    const price = cart[itemIndex].price;
    const total = price * quantity;
    cartItem.querySelector('.cart-item-total').textContent = formatPrice(total) + '₫';
    updateCartSummary();
    cartManager.updateCartCount();
  }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id != id);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Kiểm tra nếu giỏ hàng trống
  if (cart.length === 0) {
    document.querySelector('.cart-items').innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart empty-cart-icon"></i>
        <p>Giỏ hàng của bạn đang trống</p>
        <a href="index.html" class="continue-shopping">Tiếp tục mua sắm</a>
      </div>
    `;
    document.querySelector('.cart-summary').style.display = 'none';
  }
}

// Cập nhật tổng tiền
function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  document.getElementById('subtotal').textContent = formatPrice(totalPrice) + '₫';
  document.getElementById('total').textContent = formatPrice(totalPrice) + '₫';
}

// Thêm vào export
export const cartManager = {
  addToCart,
  updateCartCount,
  displayCartItems
};



