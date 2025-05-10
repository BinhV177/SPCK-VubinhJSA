document.addEventListener('DOMContentLoaded', function() {
    // Lấy thông tin người dùng từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                        JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Nếu chưa đăng nhập, chuyển về trang login
        window.location.href = 'login.html';
        return;
    }
    
    // Hiển thị thông tin người dùng
    displayUserInfo(currentUser);
    
    // Xử lý chuyển tab
    setupTabNavigation();
    
    // Xử lý form cập nhật thông tin
    setupProfileForm(currentUser);
    
    // Xử lý form đổi mật khẩu
    setupPasswordForm(currentUser);
    
    // Xử lý nút đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });
    
    // Xử lý hiệu ứng hiển thị/ẩn mật khẩu
    setupPasswordToggle();
    
    // Xử lý đánh giá độ mạnh mật khẩu
    setupPasswordStrengthMeter();
});

// Hiển thị thông tin người dùng
function displayUserInfo(user) {
    // Hiển thị thông tin trong sidebar
    document.getElementById('userName').textContent = user.username || '';
    document.getElementById('userEmail').textContent = user.email || '';
    
    // Hiển thị thông tin trong phần tổng quan
    document.getElementById('summaryName').textContent = user.username || '';
    document.getElementById('summaryEmail').textContent = user.email || '';
    document.getElementById('summaryPhone').textContent = user.phone || '';
    document.getElementById('summaryCreated').textContent = user.registeredAt ? formatDate(user.registeredAt) : '';
    
    // Điền thông tin vào form
    document.getElementById('fullName').value = user.username || '';
    document.getElementById('phone').value = user.phone || '';
    
    // Xử lý ngày sinh
    if (user.birthday) {
        const birthdayParts = user.birthday.split('/');
        if (birthdayParts.length === 3) {
            document.getElementById('day').value = parseInt(birthdayParts[0]);
            document.getElementById('month').value = parseInt(birthdayParts[1]);
            document.getElementById('year').value = parseInt(birthdayParts[2]);
        }
    }
    
    // Xử lý giới tính
    if (user.gender) {
        const genderRadio = document.querySelector(`input[name="gender"][value="${user.gender}"]`);
        if (genderRadio) {
            genderRadio.checked = true;
        }
    }
}

// Thiết lập chuyển tab
function setupTabNavigation() {
    const navLinks = document.querySelectorAll('.profile-nav a');
    const sections = document.querySelectorAll('.profile-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Xóa active class từ tất cả links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Thêm active class cho link được click
            this.classList.add('active');
            
            // Ẩn tất cả sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Hiển thị section tương ứng
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Thiết lập form cập nhật thông tin
function setupProfileForm(user) {
    const profileForm = document.getElementById('profileForm');
    
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy giá trị từ form
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const day = document.getElementById('day').value;
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        
        // Cập nhật thông tin người dùng
        user.username = fullName;
        user.phone = phone;
        user.birthday = `${day}/${month}/${year}`;
        user.gender = gender;
        
        // Lưu thông tin vào localStorage
        saveUserInfo(user);
        
        // Cập nhật hiển thị
        displayUserInfo(user);
        
        // Hiển thị thông báo thành công
        showNotification('Cập nhật thông tin thành công!', 'success');
    });
}

// Thiết lập form đổi mật khẩu
function setupPasswordForm(user) {
    const passwordForm = document.getElementById('passwordForm');
    
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Kiểm tra mật khẩu hiện tại
        if (currentPassword !== user.password) {
            showNotification('Mật khẩu hiện tại không đúng!', 'error');
            return;
        }
        
        // Kiểm tra mật khẩu mới và xác nhận
        if (newPassword !== confirmPassword) {
            showNotification('Mật khẩu mới và xác nhận không khớp!', 'error');
            return;
        }
        
        // Kiểm tra độ mạnh mật khẩu
        if (newPassword.length < 8) {
            showNotification('Mật khẩu mới phải có ít nhất 8 ký tự!', 'error');
            return;
        }
        
        // Cập nhật mật khẩu
        user.password = newPassword;
        
        // Lưu thông tin vào localStorage
        saveUserInfo(user);
        
        // Reset form
        passwordForm.reset();
        
        // Hiển thị thông báo thành công
        showNotification('Đổi mật khẩu thành công!', 'success');
    });
}

// Thiết lập hiệu ứng hiển thị/ẩn mật khẩu
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Thay đổi icon
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Thiết lập đánh giá độ mạnh mật khẩu
function setupPasswordStrengthMeter() {
    const newPasswordInput = document.getElementById('newPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Cập nhật thanh độ mạnh
            strengthBar.style.width = `${strength}%`;
            
            // Cập nhật màu sắc và text
            if (strength < 30) {
                strengthBar.style.backgroundColor = '#f44336';
                strengthText.textContent = 'Yếu';
            } else if (strength < 60) {
                strengthBar.style.backgroundColor = '#ff9800';
                strengthText.textContent = 'Trung bình';
            } else {
                strengthBar.style.backgroundColor = '#4caf50';
                strengthText.textContent = 'Mạnh';
            }
        });
    }
}

// Tính toán độ mạnh mật khẩu
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length > 0) {
        // Độ dài
        strength += Math.min(password.length * 5, 30);
        
        // Chữ hoa
        if (/[A-Z]/.test(password)) strength += 15;
        
        // Chữ thường
        if (/[a-z]/.test(password)) strength += 15;
        
        // Số
        if (/[0-9]/.test(password)) strength += 15;
        
        // Ký tự đặc biệt
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    }
    
    return Math.min(strength, 100);
}

// Lưu thông tin người dùng
function saveUserInfo(user) {
    // Lưu vào localStorage hoặc sessionStorage tùy theo lựa chọn "Ghi nhớ đăng nhập"
    if (localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    // Cập nhật trong danh sách users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-circle"></i>';
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
        }, 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    } catch (e) {
        return dateString;
    }
}
