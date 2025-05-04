import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Kiểm tra trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user);
    } else {
        window.location.href = 'login.html';
    }
});

// Load thông tin profile người dùng
async function loadUserProfile(user) {
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Cập nhật UI với thông tin user
            document.getElementById('userName').textContent = userData.username || 'Chưa cập nhật';
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('fullName').value = userData.fullName || '';
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('birthdate').value = userData.birthdate || '';
            
            if (userData.gender) {
                document.querySelector(`input[name="gender"][value="${userData.gender}"]`).checked = true;
            }
        }
    } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Populate date dropdowns
    populateDays();
    populateMonths();
    populateYears();

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) ||
                      JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Lấy thông tin chi tiết từ danh sách users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userInfo = users.find(u => u.email === currentUser.email);

    if (userInfo) {
        // Hiển thị thông tin cơ bản
        document.getElementById('userName').textContent = userInfo.username || 'Người dùng';
        document.getElementById('userEmail').textContent = userInfo.email;

        // Hiển thị thông tin tổng quan
        document.getElementById('summaryName').textContent = userInfo.username || 'Chưa cập nhật';
        document.getElementById('summaryEmail').textContent = userInfo.email;
        document.getElementById('summaryPhone').textContent = userInfo.phone || 'Chưa cập nhật';

        // Format ngày tạo tài khoản
        const createdDate = userInfo.registeredAt ? new Date(userInfo.registeredAt) : new Date();
        document.getElementById('summaryCreated').textContent = formatDate(createdDate);

        // Điền thông tin vào form
        document.getElementById('fullName').value = userInfo.username || '';
        document.getElementById('phone').value = userInfo.phone || '';

        // Chọn giới tính
        if (userInfo.gender) {
            const genderInput = document.querySelector(`input[name="gender"][value="${userInfo.gender}"]`);
            if (genderInput) {
                genderInput.checked = true;
            }
        }

        // Chọn ngày sinh nếu có
        if (userInfo.birthday) {
            // Nếu ngày sinh được lưu dưới dạng "DD/MM/YYYY"
            const parts = userInfo.birthday.split('/');
            if (parts.length === 3) {
                selectDropdownOption('day', parts[0]);
                selectDropdownOption('month', parts[1]);
                selectDropdownOption('year', parts[2]);
            }
        }
    }

    // Thiết lập giá trị mặc định cho năm sinh
    const yearInput = document.getElementById('year');
    if (yearInput) {
    const currentYear = new Date().getFullYear();
        yearInput.setAttribute('max', currentYear);
    }

    // Xác thực ngày tháng hợp lệ
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');

    if (dayInput && monthInput && yearInput) {
        const validateDate = () => {
            const day = parseInt(dayInput.value);
            const month = parseInt(monthInput.value);
            const year = parseInt(yearInput.value);

            if (day && month && year) {
                // Tính số ngày trong tháng
                const lastDayOfMonth = new Date(year, month, 0).getDate();

                // Nếu ngày không hợp lệ, đặt lại thành ngày cuối cùng của tháng
                if (day > lastDayOfMonth) {
                    dayInput.value = lastDayOfMonth;
                }
            }
        };

        // Kích hoạt xác thực khi người dùng thay đổi tháng hoặc năm
        monthInput.addEventListener('change', validateDate);
        yearInput.addEventListener('change', validateDate);

        // Thêm giới hạn cho input ngày tùy thuộc vào tháng
        monthInput.addEventListener('input', function() {
            const month = parseInt(this.value);
            if (month === 2) {
                // Tháng 2
                dayInput.setAttribute('max', '29'); // Tính cả năm nhuận
            } else if ([4, 6, 9, 11].includes(month)) {
                // Tháng 4, 6, 9, 11 có 30 ngày
                dayInput.setAttribute('max', '30');
            } else {
                // Các tháng còn lại có 31 ngày
                dayInput.setAttribute('max', '31');
            }
        });

        // Nếu đã có thông tin ngày sinh từ userInfo, điền vào
        if (userInfo && userInfo.birthday) {
            // Nếu ngày sinh được lưu dưới dạng "DD/MM/YYYY"
            const parts = userInfo.birthday.split('/');
            if (parts.length === 3) {
                dayInput.value = parseInt(parts[0]);
                monthInput.value = parseInt(parts[1]);
                yearInput.value = parseInt(parts[2]);
            }
        }
    }

    // Xử lý nút đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        showNotification('Đã đăng xuất thành công!', 'success');
    setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });

    // Xử lý chuyển đổi tab
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Xóa active class từ tất cả các link và section
            document.querySelectorAll('.profile-nav a').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));

            // Thêm active class cho link được click
            link.classList.add('active');

            // Hiển thị section tương ứng
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
}
        });
    });

    // Xử lý đổi ảnh đại diện
    document.querySelector('.change-avatar-btn').addEventListener('click', function() {
        // Tạo một input file ẩn
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length) {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onload = function(event) {
                    // Hiển thị ảnh mới
                    document.getElementById('userAvatar').src = event.target.result;

                    // Lưu ảnh vào localStorage (dưới dạng base64)
                    if (userInfo) {
                        userInfo.avatar = event.target.result;
                        const userIndex = users.findIndex(u => u.email === currentUser.email);
                        if (userIndex !== -1) {
                            users[userIndex] = userInfo;
                            localStorage.setItem('users', JSON.stringify(users));
                            showNotification('Cập nhật ảnh đại diện thành công!', 'success');
                        }
                    }
                };

                reader.readAsDataURL(file);
            }
        });

        fileInput.click();
    });

    // Xử lý form cập nhật thông tin
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Lấy ngày sinh từ các input
            const day = document.getElementById('day').value.padStart(2, '0');
            const month = document.getElementById('month').value.padStart(2, '0');
            const year = document.getElementById('year').value;
            const birthday = day && month && year ? `${day}/${month}/${year}` : '';

            const updatedData = {
                username: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                birthday: birthday,
                gender: document.querySelector('input[name="gender"]:checked')?.value
            };
            // Cập nhật thông tin trong localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...updatedData };
                localStorage.setItem('users', JSON.stringify(users));

                // Cập nhật currentUser
                const updatedCurrentUser = { ...currentUser, ...updatedData };
                if (localStorage.getItem('currentUser')) {
                    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
                }

                showNotification('Cập nhật thông tin thành công!', 'success');

                // Cập nhật hiển thị thông tin
                document.getElementById('userName').textContent = updatedData.username;
                document.getElementById('summaryName').textContent = updatedData.username;
                document.getElementById('summaryPhone').textContent = updatedData.phone || 'Chưa cập nhật';
            }
        });
    }

    // Xử lý form đổi mật khẩu
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Kiểm tra mật khẩu hiện tại
            if (userInfo.password !== currentPassword) {
                showNotification('Mật khẩu hiện tại không đúng!', 'error');
                return;
            }

            // Kiểm tra mật khẩu mới
            if (newPassword.length < 6) {
                showNotification('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
                return;
            }

            // Kiểm tra xác nhận mật khẩu
            if (newPassword !== confirmPassword) {
                showNotification('Xác nhận mật khẩu không khớp!', 'error');
                return;
            }

            // Cập nhật mật khẩu
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));

                showNotification('Đổi mật khẩu thành công!', 'success');
                passwordForm.reset();
            }
        });
    }

    // Xử lý hiển thị/ẩn mật khẩu
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});

// Populate days dropdown
function populateDays() {
    const daySelect = document.getElementById('day');
    if (!daySelect) return;

  // Xóa tất cả các option hiện tại (trừ option mặc định)
  while (daySelect.options.length > 1) {
    daySelect.remove(1);
  }

  // Thêm các option ngày
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i < 10 ? '0' + i : i.toString();
        option.textContent = i;
        daySelect.appendChild(option);
    }
}

// Populate months dropdown
function populateMonths() {
    const monthSelect = document.getElementById('month');
    if (!monthSelect) return;

  // Xóa tất cả các option hiện tại (trừ option mặc định)
  while (monthSelect.options.length > 1) {
    monthSelect.remove(1);
  }

  // Thêm các option tháng
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = (index + 1) < 10 ? '0' + (index + 1) : (index + 1).toString();
        option.textContent = month;
        monthSelect.appendChild(option);
    });
}

// Populate years dropdown
function populateYears() {
    const yearSelect = document.getElementById('year');
    if (!yearSelect) return;

  // Xóa tất cả các option hiện tại (trừ option mặc định)
  while (yearSelect.options.length > 1) {
    yearSelect.remove(1);
  }

  // Thêm các option năm
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

// Helper function to select a dropdown option
function selectDropdownOption(selectId, value) {
    const select = document.getElementById(selectId);
    if (select) {
        const option = select.querySelector(`option[value="${value}"]`);
        if (option) {
            option.selected = true;
        }
    }
}

// Format date function
function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Không xác định';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Show notification function
function showNotification(message, type) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Add icon based on type
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    } else if (type === 'warning') {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
    } else if (type === 'info') {
        icon = '<i class="fas fa-info-circle"></i>';
    }

    notification.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
