import Auth from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    Auth.checkAuth();

    const currentUser = Auth.getCurrentUser();
    const accountBtn = document.querySelector('.account-btn');

    if (currentUser) {
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
        document.getElementById('logoutBtn').addEventListener('click', () => {
            Auth.logout();
        });
    }
}); 