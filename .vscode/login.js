import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');
const messageDiv = document.createElement('div');
messageDiv.className = 'message';
loginForm.appendChild(messageDiv);

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Reset message
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Lưu trạng thái đăng nhập nếu chọn "Ghi nhớ đăng nhập"
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('userEmail', email);
        }

        // Hiển thị thông báo thành công
        showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
        
        // Chuyển đến trang chủ sau 1 giây
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

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
    messageDiv.textContent = message;
    messageDiv.className = 'message error';
}

function showSuccess(message) {
    messageDiv.textContent = message;
    messageDiv.className = 'message success';
} 