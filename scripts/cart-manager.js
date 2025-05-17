// Quản lý giỏ hàng
const cartManager = {
    // Lấy giỏ hàng từ localStorage
    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },
    
    // Lưu giỏ hàng vào localStorage
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    
    // Thêm sản phẩm vào giỏ hàng
    addToCart(product) {
        if (!product || !product.id) {
            console.error('Thông tin sản phẩm không hợp lệ');
            return false;
        }
        
        // Lấy giỏ hàng từ localStorage
        let cart = this.getCart();
        
        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Nếu đã có, tăng số lượng
            cart[existingItemIndex].quantity += product.quantity || 1;
        } else {
            // Nếu chưa có, thêm mới
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        // Lưu giỏ hàng vào localStorage
        this.saveCart(cart);
        
        // Cập nhật số lượng hiển thị
        this.updateCartCount();
        
        return true;
    },
    
    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart(productId) {
        const cart = this.getCart().filter(item => item.id !== productId);
        this.saveCart(cart);
        this.updateCartCount();
        return cart;
    },
    
    // Cập nhật số lượng sản phẩm
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity = quantity;
            
            // Nếu số lượng = 0, xóa sản phẩm
            if (item.quantity <= 0) {
                return this.removeFromCart(productId);
            }
            
            this.saveCart(cart);
            this.updateCartCount();
        }
        
        return cart;
    },
    
    // Xóa tất cả sản phẩm trong giỏ hàng
    clearCart() {
        this.saveCart([]);
        this.updateCartCount();
        return [];
    },
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount() {
        const cart = this.getCart();
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartBadges = document.querySelectorAll('.cart-badge');
        cartBadges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
        
        return count;
    },
    
    // Tính tổng tiền giỏ hàng
    getTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
};

// Hàm tiện ích để thêm sản phẩm vào giỏ hàng
export function addToCart(product) {
    return cartManager.addToCart(product);
}

// Hàm tiện ích để cập nhật số lượng hiển thị
export function updateCartCount() {
    return cartManager.updateCartCount();
}

// Cập nhật số lượng khi trang tải
document.addEventListener('DOMContentLoaded', function() {
    cartManager.updateCartCount();
});

export default cartManager;

