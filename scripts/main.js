import Auth from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Sửa đoạn này - chỉ kiểm tra đăng nhập ở trang index.html
    if (window.location.pathname.endsWith('index.html')) {
        // Kiểm tra đăng nhập
        Auth.checkAuth();
    }
    
    // Không chạy checkAuthPages() ở đây nếu đang ở trang register
    if (!window.location.pathname.includes('register.html')) {
        Auth.checkAuthPages();
    }

    const currentUser = Auth.getCurrentUser();
    const accountBtn = document.querySelector('.account-btn');

    if (currentUser && accountBtn) {
        // Cập nhật giao diện khi đã đăng nhập
        accountBtn.innerHTML = `
            <div class="user-menu">
                <i class="fas fa-user"></i>
                <div class="user-dropdown">
                    <span>${currentUser.username}</span>
                    <button id="logoutBtn">Đăng xuất</button>
                </div>
            </div>
        `;

        // Xử lý đăng xuất
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
            });
        }
    }
});

// Xử lý nút tài khoản
document.querySelector('.icon-btn[title="Tài khoản"]').addEventListener('click', function(e) {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    if (user) {
        // Nếu đã đăng nhập, chuyển đến trang profile
        window.location.href = 'profile.html';
    } else {
        // Nếu chưa đăng nhập, chuyển đến trang login
        window.location.href = 'login.html';
    }
}); 

// Xử lý form đăng ký nhận thông tin
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Hiển thị thông báo thành công
                showNotification('Đăng ký nhận thông tin thành công!', 'success');
                
                // Reset form
                emailInput.value = '';
                
                // Lưu email vào localStorage (tùy chọn)
                saveSubscriber(email);
            }
        });
    }
});

// Hàm lưu email người đăng ký
function saveSubscriber(email) {
    // Lấy danh sách đã đăng ký
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    
    // Kiểm tra email đã tồn tại chưa
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'info') {
    // Kiểm tra container đã tồn tại chưa
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
