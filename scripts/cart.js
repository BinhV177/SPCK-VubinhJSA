let cart = [];

// Lấy giỏ hàng từ localStorage
function getCart() {
    const cartJson = localStorage.getItem('cart');
    cart = cartJson ? JSON.parse(cartJson) : [];
    return cart;
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cập nhật số lượng badge trên icon giỏ hàng
function updateCartCount() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalItems;
    }
}

// Hiển thị sản phẩm trong giỏ hàng (trên trang cart.html)
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return; // Thoát nếu không phải trang giỏ hàng

    cartItemsContainer.innerHTML = ''; // Xóa nội dung cũ

    // Lọc bỏ các sản phẩm có số lượng <= 0 trước khi hiển thị
    const itemsToDisplay = cart.filter(item => item.qty > 0);

    if (itemsToDisplay.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Giỏ hàng của bạn đang trống.</p>';
        updateCartTotal(); // Cập nhật tổng tiền là 0
        return;
    }

    itemsToDisplay.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.dataset.id = item.id; // Lưu ID sản phẩm

        // Đảm bảo item.price tồn tại và là số trước khi định dạng
        const itemPrice = typeof item.price === 'number' ? item.price : 0;

        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${itemPrice.toLocaleString('vi-VN')}₫</p>
            </div>
            <div class="item-quantity">
                <button class="decrease-qty">-</button>
                <input type="number" value="${item.qty}" min="0" class="qty-input">
                <button class="increase-qty">+</button>
            </div>
            <button class="remove-item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    updateCartTotal(); // Cập nhật tổng tiền sau khi hiển thị
    addCartEventListeners(); // Thêm lại event listeners sau khi render lại
}

// Cập nhật tổng tiền và subtotal
function updateCartTotal() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');

    // Kiểm tra xem các phần tử có tồn tại không trước khi cập nhật
    if (!subtotalElement || !totalElement) return; 

    const subtotal = cart.reduce((sum, item) => {
        // Đảm bảo item.price tồn tại và là số trước khi tính toán
        const itemPrice = typeof item.price === 'number' ? item.price : 0;
        return sum + itemPrice * item.qty;
    }, 0);

    // Giả định không có mã giảm giá hoặc thuế phức tạp cho ví dụ này
    const total = subtotal; 

    subtotalElement.textContent = subtotal.toLocaleString('vi-VN') + '₫';
    totalElement.textContent = total.toLocaleString('vi-VN') + '₫';
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    // Kiểm tra dữ liệu sản phẩm
    if (!product || !product.id || !product.name || typeof product.price !== 'number') {
        console.error('Dữ liệu sản phẩm không hợp lệ:', product);
        showToast('Thông báo', 'Không thể thêm sản phẩm vào giỏ hàng.', 'error');
        return;
    }

    let found = cart.find(item => item.id === product.id);

    if (found) {
        found.qty += 1;
    } else {
        // Khi thêm mới, đảm bảo số lượng là 1
        cart.push({...product, qty: 1});
    }

    saveCart();
    updateCartCount();
    // Chỉ hiển thị thông báo toast nếu không ở trang giỏ hàng (vì ở trang giỏ hàng sẽ render lại list)
    if (!document.getElementById('cart-items')) {
         showToast('Thành công', `Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
    }
   
    // Nếu ở trang giỏ hàng, cập nhật lại hiển thị
    if (document.getElementById('cart-items')) {
        displayCart();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
     // Tìm tên sản phẩm trước khi xóa để hiển thị thông báo
     const productToRemove = cart.find(item => item.id == productId);

    cart = cart.filter(item => item.id != productId);
    saveCart();
    updateCartCount();
    displayCart(); // Cập nhật lại hiển thị giỏ hàng

     if (productToRemove) {
        showToast('Đã xóa', `Đã xóa "${productToRemove.name}" khỏi giỏ hàng.`, 'info');
    } else {
         showToast('Thông báo', 'Đã xóa sản phẩm khỏi giỏ hàng.', 'info');
    }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id == productId);
    if (item) {
        const newQty = parseInt(quantity, 10);
        if (!isNaN(newQty) && newQty > 0) { // Đảm bảo số lượng mới là số dương
             item.qty = newQty;
             saveCart();
             updateCartCount();
             updateCartTotal(); // Cập nhật lại tổng tiền
              // Cập nhật hiển thị số lượng trên input
            const inputElement = document.querySelector(`.cart-item[data-id="${productId}"] .qty-input`);
             if(inputElement) {
                 inputElement.value = item.qty;
             }
        } else if (newQty <= 0) {
             // Nếu số lượng <= 0, xóa sản phẩm
             removeFromCart(productId);
        } else {
             // Trường hợp nhập không phải số, đặt lại giá trị input
             const inputElement = document.querySelector(`.cart-item[data-id="${productId}"] .qty-input`);
             if(inputElement && item) inputElement.value = item.qty;
        }
    }
}

// Thêm event listeners cho các nút trong giỏ hàng
function addCartEventListeners() {
     // Gỡ bỏ các event listener cũ để tránh trùng lặp bằng cách clone node (hiệu quả hơn trên các trang khác cart.html)
     // Trên cart.html, displayCart render lại toàn bộ, nên event listeners cần được thêm lại
    
    // Event delegation cho nút xóa
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.closest('.cart-item').dataset.id;
             // Hiển thị modal xác nhận trước khi xóa
            itemToRemoveId = productId; // Lưu ID sản phẩm cần xóa vào biến toàn cục (hoặc biến có phạm vi phù hợp)
            showConfirmDeleteModal();
        });
    });

    // Event delegation cho nút tăng số lượng
    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.id;
            const qtyInput = cartItem.querySelector('.qty-input');
            let currentQty = parseInt(qtyInput.value, 10);
             if (!isNaN(currentQty)){
                updateCartQuantity(productId, currentQty + 1);
             }
        });
    });

    // Event delegation cho nút giảm số lượng
    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.id;
            const qtyInput = cartItem.querySelector('.qty-input');
            let currentQty = parseInt(qtyInput.value, 10);
             if (!isNaN(currentQty) && currentQty > 0) {
               updateCartQuantity(productId, currentQty - 1);
             } else if (!isNaN(currentQty) && currentQty <= 0) {
                  // Nếu số lượng đã <= 0, kích hoạt xóa sản phẩm
                 removeFromCart(productId);
             }
        });
    });

    // Event delegation cho input số lượng
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.closest('.cart-item').dataset.id;
            const newQty = parseInt(this.value, 10);
             // Gọi updateCartQuantity để xử lý cả trường hợp nhập số dương và <= 0
            updateCartQuantity(productId, newQty);
        });
    });
}

// Hàm hiển thị toast notification (có thể đã có trong main.js, giữ lại đây phòng trường hợp cần)
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        // Tạo container nếu chưa có
        const newContainer = document.createElement('div');
        newContainer.id = 'toast-container';
        document.body.appendChild(newContainer);
        toastContainer = newContainer;
    }

    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
            <strong>${title}</strong>
            <button type="button" class="close" aria-label="Close">&times;</button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    toastContainer.appendChild(toast);

    // Đóng toast khi click nút close
    toast.querySelector('.close').addEventListener('click', function() {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    });

    // Tự động đóng sau 5 giây
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Modal Xác nhận Xóa (Giữ lại code modal đã thêm trước đó)
let confirmDeleteModal = null;
let itemToRemoveId = null;

document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ... // Giữ lại các event listeners DOMContentLoaded khác nếu có

    // Khởi tạo Modal (nếu chưa có)
    confirmDeleteModal = document.getElementById('confirmDeleteModal');
    if (confirmDeleteModal) {
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const closeBtn = confirmDeleteModal.querySelector('.close');

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', function() {
                if (itemToRemoveId !== null) {
                    removeFromCart(itemToRemoveId);
                    hideConfirmDeleteModal();
                    itemToRemoveId = null; // Reset
                }
            });
        }

        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', function() {
                hideConfirmDeleteModal();
                itemToRemoveId = null; // Reset
            });
        }

         if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                hideConfirmDeleteModal();
                itemToRemoveId = null; // Reset
            });
        }

        // Đóng modal khi click ra ngoài
        window.addEventListener('click', function(event) {
            if (event.target === confirmDeleteModal) {
                hideConfirmDeleteModal();
                itemToRemoveId = null; // Reset
            }
        });
    }

     // Cập nhật event listener cho nút xóa sản phẩm để mở modal (sử dụng delegation)
     const cartItemsContainer = document.getElementById('cart-items');
     if(cartItemsContainer) {
         cartItemsContainer.addEventListener('click', function(event) {
             const target = event.target;
             const removeBtn = target.closest('.remove-item');
             if(removeBtn) {
                 const cartItem = removeBtn.closest('.cart-item');
                 if(cartItem) {
                     itemToRemoveId = cartItem.dataset.id; // Lưu ID sản phẩm cần xóa
                     showConfirmDeleteModal();
                 }
             }
         });
     }

     // Khởi tạo giỏ hàng và hiển thị khi trang tải
     getCart();
     updateCartCount(); // Cập nhật badge giỏ hàng trên header

     // Nếu đang ở trang giỏ hàng (cart.html), hiển thị giỏ hàng chi tiết
     if (document.getElementById('cart-items')) {
         displayCart(); // Hiển thị danh sách sản phẩm trong giỏ hàng
     }

     // Event delegation cho nút thêm vào giỏ hàng trên các trang sản phẩm (đặt ở đây hoặc main.js)
     // Tốt nhất nên đặt event delegation cho các hành động chung trên `document.body` trong main.js
     // Tuy nhiên, nếu cart.js được include sau main.js trên trang sản phẩm, có thể đặt ở đây.
     // Để tránh trùng lặp và dễ quản lý, tôi sẽ giữ lại event listener này trong main.js và đảm bảo thứ tự include script đúng.

});

function showConfirmDeleteModal() {
    if (confirmDeleteModal) {
        confirmDeleteModal.style.display = 'block';
         // Thêm lớp CSS để làm mờ nền
         document.body.classList.add('modal-open');
    }
}

function hideConfirmDeleteModal() {
    if (confirmDeleteModal) {
        confirmDeleteModal.style.display = 'none';
         // Xóa lớp CSS làm mờ nền
         document.body.classList.remove('modal-open');
    }
}

// Đảm bảo các hàm cần thiết có thể truy cập từ bên ngoài nếu các script khác gọi đến
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.displayCart = displayCart;
window.updateCartTotal = updateCartTotal;
window.getCart = getCart;
window.saveCart = saveCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.showToast = showToast; // Đảm bảo chỉ có một định nghĩa hàm showToast

// Các hàm liên quan đến wishlist đã được xóa.

