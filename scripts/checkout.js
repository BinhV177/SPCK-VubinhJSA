import { cartManager, showNotification } from './cart-manager.js';

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

document.addEventListener('DOMContentLoaded', function() {
    // Thiết lập modal thanh toán
    setupCheckoutModal();
    
    // Xử lý form thanh toán
    setupCheckoutForm();
});

// Thiết lập modal thanh toán
function setupCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');
    
    if (!modal) return;
    
    // Đóng modal khi click vào nút đóng
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (modal) modal.style.display = 'none';
            if (successModal) successModal.style.display = 'none';
        });
    });
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        
        if (successModal && e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Xử lý nút hủy
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Xử lý nút tiếp tục mua sắm trong modal thành công
    const continueShopping = document.getElementById('continueShopping');
    if (continueShopping) {
        continueShopping.addEventListener('click', function() {
            if (successModal) successModal.style.display = 'none';
            window.location.href = 'index.html';
        });
    }
}

// Thiết lập form thanh toán
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Kiểm tra form
        if (validateCheckoutForm()) {
            // Xử lý đặt hàng
            processOrder();
        }
    });
    
    // Xử lý chuyển đổi phương thức thanh toán
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentDetails = document.querySelectorAll('.payment-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Ẩn tất cả các chi tiết thanh toán
            paymentDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Hiển thị chi tiết thanh toán tương ứng
            const selectedMethod = document.getElementById(`${this.value}Details`);
            if (selectedMethod) {
                selectedMethod.style.display = 'block';
            }
        });
    });
}

// Kiểm tra form thanh toán
function validateCheckoutForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const district = document.getElementById('district').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    // Kiểm tra tên
    if (!fullName) {
        showNotification('Vui lòng nhập họ tên!', 'error');
        return false;
    }
    
    // Kiểm tra email
    if (!email || !isValidEmail(email)) {
        showNotification('Vui lòng nhập email hợp lệ!', 'error');
        return false;
    }
    
    // Kiểm tra số điện thoại
    if (!phone || !isValidPhone(phone)) {
        showNotification('Vui lòng nhập số điện thoại hợp lệ!', 'error');
        return false;
    }
    
    // Kiểm tra địa chỉ
    if (!address) {
        showNotification('Vui lòng nhập địa chỉ!', 'error');
        return false;
    }
    
    // Kiểm tra thành phố
    if (!city) {
        showNotification('Vui lòng chọn thành phố!', 'error');
        return false;
    }
    
    // Kiểm tra quận/huyện
    if (!district) {
        showNotification('Vui lòng chọn quận/huyện!', 'error');
        return false;
    }
    
    // Kiểm tra phương thức thanh toán
    if (!paymentMethod) {
        showNotification('Vui lòng chọn phương thức thanh toán!', 'error');
        return false;
    }
    
    // Kiểm tra thông tin thẻ nếu thanh toán bằng thẻ
    if (paymentMethod.value === 'creditCard') {
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const cardName = document.getElementById('cardName').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        
        if (!cardNumber || !isValidCardNumber(cardNumber)) {
            showNotification('Vui lòng nhập số thẻ hợp lệ!', 'error');
            return false;
        }
        
        if (!cardName) {
            showNotification('Vui lòng nhập tên chủ thẻ!', 'error');
            return false;
        }
        
        if (!expiryDate || !isValidExpiryDate(expiryDate)) {
            showNotification('Vui lòng nhập ngày hết hạn hợp lệ (MM/YY)!', 'error');
            return false;
        }
        
        if (!cvv || !isValidCVV(cvv)) {
            showNotification('Vui lòng nhập mã CVV hợp lệ!', 'error');
            return false;
        }
    }
    
    return true;
}

// Xử lý đặt hàng
function processOrder() {
    // Lấy thông tin đơn hàng
    const cart = cartManager.getCart();
    const subtotal = cartManager.getCartTotal();
    const discountPercent = parseInt(localStorage.getItem('discountPercent')) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;
    
    // Lấy thông tin người dùng
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const district = document.getElementById('district').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const note = document.getElementById('orderNote').value.trim();
    
    // Tạo đơn hàng
    const order = {
        id: generateOrderId(),
        items: cart,
        customer: {
            fullName,
            email,
            phone,
            address: `${address}, ${district}, ${city}`
        },
        payment: {
            method: paymentMethod,
            subtotal,
            discount: discountAmount,
            total
        },
        note,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Lưu đơn hàng vào localStorage
    saveOrder(order);
    
    // Xóa giỏ hàng
    cartManager.clearCart();
    
    // Xóa mã giảm giá
    localStorage.removeItem('couponCode');
    localStorage.removeItem('discountPercent');
    
    // Hiển thị modal thành công
    showSuccessModal(order);
}

// Tạo mã đơn hàng
function generateOrderId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `CB${timestamp}${random}`;
}

// Lưu đơn hàng vào localStorage
function saveOrder(order) {
    // Lấy danh sách đơn hàng
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Thêm đơn hàng mới
    orders.push(order);
    
    // Lưu danh sách đơn hàng
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Lưu đơn hàng hiện tại
    localStorage.setItem('currentOrder', JSON.stringify(order));
}

// Hiển thị modal thành công
function showSuccessModal(order) {
    const modal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');
    
    if (!modal || !successModal) return;
    
    // Ẩn modal thanh toán
    modal.style.display = 'none';
    
    // Cập nhật thông tin đơn hàng trong modal thành công
    const orderIdElement = document.getElementById('orderId');
    const orderDateElement = document.getElementById('orderDate');
    const orderTotalElement = document.getElementById('orderTotal');
    
    if (orderIdElement) orderIdElement.textContent = order.id;
    if (orderDateElement) orderDateElement.textContent = formatDate(new Date());
    if (orderTotalElement) orderTotalElement.textContent = formatPrice(order.payment.total) + '₫';
    
    // Hiển thị modal thành công
    successModal.style.display = 'flex';
}

// Cập nhật thông tin đơn hàng trong modal thanh toán
function updateOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderDiscount = document.getElementById('orderDiscount');
    const orderTotal = document.getElementById('orderTotal');
    
    if (!orderItemsContainer || !orderSubtotal || !orderDiscount || !orderTotal) return;
    
    // Lấy giỏ hàng
    const cart = cartManager.getCart();
    
    // Hiển thị sản phẩm
    let orderItemsHTML = '';
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        
        orderItemsHTML += `
            <div class="order-item">
                <div class="order-item-info">
                    <span class="order-item-name">${item.name}</span>
                    <span class="order-item-quantity">x${item.quantity}</span>
                </div>
                <div class="order-item-price">${formatPrice(subtotal)}₫</div>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = orderItemsHTML;
    
    // Tính tổng tiền
    const subtotal = cartManager.getCartTotal();
    const discountPercent = parseInt(localStorage.getItem('discountPercent')) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;
    
    // Hiển thị tổng tiền
    orderSubtotal.textContent = formatPrice(subtotal) + '₫';
    orderDiscount.textContent = formatPrice(discountAmount) + '₫';
    orderTotal.textContent = formatPrice(total) + '₫';
}

// Kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Kiểm tra số điện thoại hợp lệ
function isValidPhone(phone) {
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
}

// Kiểm tra số thẻ hợp lệ
function isValidCardNumber(cardNumber) {
    const cardNumberRegex = /^[0-9]{16}$/;
    return cardNumberRegex.test(cardNumber.replace(/\s/g, ''));
}

// Kiểm tra ngày hết hạn hợp lệ
function isValidExpiryDate(expiryDate) {
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryDateRegex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
    const today = new Date();
    
    return expiry > today;
}

// Kiểm tra mã CVV hợp lệ
function isValidCVV(cvv) {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
}

// Format ngày
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}