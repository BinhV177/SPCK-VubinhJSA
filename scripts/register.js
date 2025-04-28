// Khởi tạo dữ liệu mẫu nếu chưa có
const initializeData = () => {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
};

// Lấy tất cả users
const getAllUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

// Thêm user mới
const addUser = (user) => {
    const users = getAllUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Danh sách users sau khi thêm:', getAllUsers());
};

// Kiểm tra email đã tồn tại
const isEmailExists = (email) => {
    const users = getAllUsers();
    return users.some(user => user.email === email);
};

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo dữ liệu
    initializeData();

    // Lấy form đăng ký
    const registerForm = document.getElementById('registerForm');

    // Tạo phần tử hiển thị thông báo
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    registerForm.appendChild(messageDiv);

    // Xử lý sự kiện khi form được submit
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Ngăn chặn form submit mặc định

        // Lấy giá trị từ form
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const terms = document.getElementById('terms').checked;

        console.log('Đang xử lý đăng ký với:', { username, email, password, terms });

        // Kiểm tra điều kiện
        if (!username || !email || !password) {
            showMessage('Vui lòng điền đầy đủ thông tin', 'error');
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!terms) {
            showMessage('Vui lòng đồng ý với điều khoản sử dụng', 'error');
            alert('Vui lòng đồng ý với điều khoản sử dụng');
            return;
        }

        if (username.length < 3) {
            showMessage('Tên người dùng phải có ít nhất 3 ký tự', 'error');
            alert('Tên người dùng phải có ít nhất 3 ký tự');
            return;
        }

        if (password.length < 6) {
            showMessage('Mật khẩu phải có ít nhất 6 ký tự', 'error');
            alert('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            // Kiểm tra email tồn tại
            if (isEmailExists(email)) {
                showMessage('Email này đã được sử dụng', 'error');
                alert('Email này đã được sử dụng');
                return;
            }

            // Tạo user mới
            const newUser = {
                id: Date.now().toString(),
                username: username,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };

            // Thêm user mới
            console.log('Gọi addUser với:', newUser);
            addUser(newUser);
            console.log('Đã thêm user mới:', newUser);

            // Lưu email để điền sẵn ở trang login
            sessionStorage.setItem('registeredEmail', email);

            showMessage('Đăng ký thành công! Đang chuyển hướng...', 'success');
            alert('Đăng ký thành công!');

            // Chuyển hướng sau 1.5 giây
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            console.error('Lỗi khi đăng ký:', error);
            alert('Có lỗi xảy ra: ' + error.message);
            showMessage('Có lỗi xảy ra: ' + error.message, 'error');
        }
    });

    // Hàm hiển thị thông báo
    function showMessage(text, type) {
        console.log('Hiển thị thông báo:', { text, type });
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }
}); 