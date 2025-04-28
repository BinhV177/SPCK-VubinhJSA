document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    loginForm.appendChild(messageDiv);

    // Điền email đã đăng ký (nếu có)
    const registeredEmail = sessionStorage.getItem('registeredEmail');
    if (registeredEmail) {
        document.getElementById('email').value = registeredEmail;
        showMessage('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        sessionStorage.removeItem('registeredEmail');
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (!email || !password) {
            showMessage('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        // Lấy danh sách users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('Danh sách users:', users);

        // Tìm user
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showMessage('Email hoặc mật khẩu không chính xác', 'error');
            return;
        }

        // Lưu thông tin đăng nhập
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
        }

        showMessage('Đăng nhập thành công! Đang chuyển hướng...', 'success');

        // Chuyển đến trang chủ sau 1.5 giây
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }
}); 