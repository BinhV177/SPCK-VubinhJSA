import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');
const errorMessage = document.createElement('div');
errorMessage.className = 'error-message';
loginForm.appendChild(errorMessage);

// Kiểm tra trạng thái đăng nhập
auth.onAuthStateChanged((user) => {
    if (user) {
        // Nếu đã đăng nhập, lưu thông tin vào localStorage
        localStorage.setItem('userEmail', user.email);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Lưu trạng thái "Ghi nhớ đăng nhập"
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberMe');
        }

        // Hiển thị thông báo thành công
        showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
        
        // Chuyển hướng về trang chủ
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        switch (error.code) {
            case 'auth/invalid-email':
                showError('Email không hợp lệ');
                break;
            case 'auth/user-disabled':
                showError('Tài khoản đã bị khóa');
                break;
            case 'auth/user-not-found':
                showError('Không tìm thấy tài khoản với email này');
                break;
            case 'auth/wrong-password':
                showError('Mật khẩu không chính xác');
                break;
            default:
                showError('Đã có lỗi xảy ra. Vui lòng thử lại sau');
                console.error(error);
        }
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = '#e74c3c';
    errorMessage.style.display = 'block';
}

function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = '#2ecc71';
    errorMessage.style.display = 'block';
} 