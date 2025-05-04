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
