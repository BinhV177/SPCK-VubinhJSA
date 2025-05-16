import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const registerForm = document.getElementById('registerForm');
const messageDiv = document.createElement('div');
messageDiv.className = 'message';
registerForm.appendChild(messageDiv);

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;

    // Reset message
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    // Validate
    if (!terms) {
        showError('Vui lòng đồng ý với điều khoản sử dụng');
        return;
    }

    if (username.length < 3) {
        showError('Tên người dùng phải có ít nhất 3 ký tự');
        return;
    }

    if (password.length < 6) {
        showError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }

    try {
        // Tạo tài khoản
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Lưu thông tin bổ sung vào Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date().toISOString()
        });

        // Hiển thị thông báo thành công
        showSuccess('Đăng ký thành công! Đang chuyển hướng...');
        
        // Chuyển đến trang đăng nhập sau 2 giây
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                showError('Email này đã được sử dụng');
                break;
            case 'auth/invalid-email':
                showError('Email không hợp lệ');
                break;
            case 'auth/operation-not-allowed':
                showError('Tài khoản email/mật khẩu chưa được kích hoạt');
                break;
            case 'auth/weak-password':
                showError('Mật khẩu quá yếu');
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