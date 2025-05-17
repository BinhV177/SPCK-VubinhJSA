class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.render();
    }

    addItem(product) {
        if (!this.items.find(item => item.id === product.id)) {
            this.items.push(product);
            this.saveWishlist();
            this.render();
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveWishlist();
        this.render();
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }

    render() {
        const wishlistItems = document.querySelector('.wishlist-items');
        wishlistItems.innerHTML = this.items.map(item => `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="wishlist-item-price">${item.price.toLocaleString('vi-VN')}đ</p>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart-btn" onclick="wishlist.addToCart('${item.id}')">Thêm vào giỏ</button>
                    <button class="remove-btn" onclick="wishlist.removeItem('${item.id}')">Xóa</button>
                </div>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.items.find(item => item.id === productId);
        if (product) {
            // Gọi hàm addItem của Cart
            if (typeof cart !== 'undefined') {
                cart.addItem(product);
            }
        }
    }
}

const wishlist = new Wishlist(); 