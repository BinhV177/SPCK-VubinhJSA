// Dữ liệu sản phẩm
const products = {
    women: [
        {
            id: 1,
            name: "Váy liền thân công sở",
            price: 450000,
            salePrice: 350000,
            category: "women",
            colors: ["den", "trang", "xanh"],
            sizes: ["S", "M", "L", "XL"],
            images: [
                "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Váy liền thân công sở thiết kế thanh lịch, phù hợp cho môi trường làm việc chuyên nghiệp. Chất liệu vải cao cấp, thoáng mát và không nhăn.",
            material: "Polyester 65%, Cotton 35%",
            care: "Giặt máy 30 độ, không là",
            stock: 50
        },
        {
            id: 2,
            name: "Áo sơ mi nữ cổ trụ",
            price: 320000,
            category: "women",
            colors: ["trang", "xanh"],
            sizes: ["S", "M", "L"],
            images: [
                "https://images.unsplash.com/photo-1604575396136-79d175778d1d?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1604575396136-79d175778d1d?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Áo sơ mi nữ cổ trụ thiết kế đơn giản, thanh lịch. Chất liệu cotton mềm mại, thoáng mát.",
            material: "Cotton 100%",
            care: "Giặt máy 30 độ, là ở nhiệt độ trung bình",
            stock: 35
        },
        {
            id: 5,
            name: "Quần jean nữ ống rộng",
            price: 420000,
            salePrice: 350000,
            category: "women",
            colors: ["xanh", "den"],
            sizes: ["S", "M", "L", "XL"],
            images: [
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Quần jean nữ ống rộng thiết kế hiện đại, phong cách. Chất liệu denim co giãn, thoải mái khi mặc.",
            material: "Cotton 98%, Elastane 2%",
            care: "Giặt máy 30 độ, không là",
            stock: 40
        },
        {
            id: 6,
            name: "Áo len nữ cổ lọ",
            price: 380000,
            category: "women",
            colors: ["den", "xanh", "do"],
            sizes: ["S", "M", "L"],
            images: [
                "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Áo len nữ cổ lọ thiết kế đơn giản, ấm áp. Chất liệu len mềm mại, không gây ngứa.",
            material: "Wool 70%, Acrylic 30%",
            care: "Giặt tay, không là",
            stock: 30
        },
        {
            id: 7,
            name: "Váy đầm dự tiệc",
            price: 850000,
            salePrice: 650000,
            category: "women",
            colors: ["den", "do"],
            sizes: ["S", "M", "L"],
            images: [
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Váy đầm dự tiệc thiết kế sang trọng, quyến rũ. Chất liệu vải cao cấp, bóng bẩy.",
            material: "Polyester 80%, Silk 20%",
            care: "Giặt khô",
            stock: 25
        }
    ],
    men: [
        {
            id: 3,
            name: "Áo sơ mi nam trắng",
            price: 380000,
            salePrice: 300000,
            category: "men",
            colors: ["trang", "xanh"],
            sizes: ["M", "L", "XL", "XXL"],
            images: [
                "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Áo sơ mi nam trắng thiết kế cổ điển, phù hợp cho mọi dịp. Chất liệu cotton cao cấp, thoáng mát.",
            material: "Cotton 100%",
            care: "Giặt máy 30 độ, là ở nhiệt độ trung bình",
            stock: 40
        },
        {
            id: 4,
            name: "Quần jean nam slim fit",
            price: 550000,
            category: "men",
            colors: ["xanh", "den"],
            sizes: ["28", "30", "32", "34"],
            images: [
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Quần jean nam slim fit thiết kế ôm sát, tôn dáng. Chất liệu denim cao cấp, co giãn tốt.",
            material: "Cotton 98%, Elastane 2%",
            care: "Giặt máy 30 độ, không là",
            stock: 45
        },
        {
            id: 8,
            name: "Áo khoác bomber nam",
            price: 750000,
            salePrice: 600000,
            category: "men",
            colors: ["den", "xanh"],
            sizes: ["M", "L", "XL"],
            images: [
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Áo khoác bomber nam thiết kế thể thao, năng động. Chất liệu vải bóng, chống nước nhẹ.",
            material: "Polyester 100%",
            care: "Giặt máy 30 độ, không là",
            stock: 35
        },
        {
            id: 9,
            name: "Quần tây nam công sở",
            price: 450000,
            category: "men",
            colors: ["den", "xam"],
            sizes: ["28", "30", "32", "34", "36"],
            images: [
                "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Quần tây nam công sở thiết kế thanh lịch, chuyên nghiệp. Chất liệu vải cao cấp, không nhăn.",
            material: "Polyester 65%, Cotton 35%",
            care: "Giặt máy 30 độ, là ở nhiệt độ trung bình",
            stock: 50
        },
        {
            id: 10,
            name: "Áo len nam cổ tròn",
            price: 420000,
            salePrice: 350000,
            category: "men",
            colors: ["den", "xam", "xanh"],
            sizes: ["M", "L", "XL", "XXL"],
            images: [
                "https://images.unsplash.com/photo-1614975058789-41316d0e2cc9?w=500&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1614975058789-41316d0e2cc9?w=500&auto=format&fit=crop&q=60"
            ],
            description: "Áo len nam cổ tròn thiết kế đơn giản, ấm áp. Chất liệu len mềm mại, không gây ngứa.",
            material: "Wool 70%, Acrylic 30%",
            care: "Giặt tay, không là",
            stock: 40
        }
    ]
};

// Hàm lấy tất cả sản phẩm
function getAllProducts() {
    return [...products.women, ...products.men];
}

// Hàm lấy sản phẩm theo ID
function getProductById(id) {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === id);
}

// Hàm lấy sản phẩm theo danh mục
function getProductsByCategory(category) {
    return products[category] || [];
}

// Hàm lọc sản phẩm
function filterProducts(filters) {
    let result = getAllProducts();
    
    if (filters.category) {
        result = result.filter(p => p.category === filters.category);
    }
    
    if (filters.color) {
        result = result.filter(p => p.colors.includes(filters.color));
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    
    if (filters.sort) {
        result.sort((a, b) => {
            const priceA = a.salePrice || a.price;
            const priceB = b.salePrice || b.price;
            return filters.sort === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }
    
    return result;
}

// Hàm xử lý giỏ hàng
const cartManager = {
    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },
    
    addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const product = getProductById(productId);
        
        if (!product) return false;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.salePrice || product.price,
                image: product.images[0],
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartBadge();
        
        // Hiển thị thông báo
        this.showNotification('Đã thêm sản phẩm vào giỏ hàng');
        return true;
    },
    
    removeFromCart(productId) {
        const cart = this.getCart();
        const newCart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(newCart));
        this.updateCartBadge();
        this.showNotification('Đã xóa sản phẩm khỏi giỏ hàng');
    },
    
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity = parseInt(quantity) || 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartBadge();
        }
    },
    
    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartBadge();
    },
    
    updateCartBadge() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => {
            const quantity = parseInt(item.quantity) || 0;
            return sum + quantity;
        }, 0);
        
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = totalItems || '0';
        }
    },
    
    getTotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + (price * quantity);
        }, 0);
    },

    showNotification(message) {
        // Tạo thông báo
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // Thêm vào body
        document.body.appendChild(notification);
        
        // Hiển thị thông báo
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Xóa thông báo sau 3 giây
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
};

// Export các hàm và đối tượng cần thiết
export {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    filterProducts,
    cartManager
}; 