import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const registerForm = document.getElementById('registerForm');
const errorMessage = document.createElement('div');
errorMessage.className = 'error-message';
registerForm.appendChild(errorMessage);

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;

    // Kiểm tra điều khoản sử dụng
    if (!terms) {
        showError('Vui lòng đồng ý với điều khoản sử dụng');
        return;
    }

    // Validate dữ liệu
    if (username.length < 3) {
        showError('Tên đăng nhập phải có ít nhất 3 ký tự');
        return;
    }

    if (password.length < 6) {
        showError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }

    try {
        // Tạo tài khoản mới
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Lưu thông tin bổ sung vào Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date().toISOString(),
            role: 'user'
        });

        // Hiển thị thông báo thành công
        showSuccess('Đăng ký thành công! Đang chuyển hướng...');
        
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        // Xử lý các lỗi
        switch (error.code) {
            case 'auth/email-already-in-use':
                showError('Email này đã được sử dụng');
                break;
            case 'auth/invalid-email':
                showError('Email không hợp lệ');
                break;
            case 'auth/operation-not-allowed':
                showError('Chức năng đăng ký đang bị vô hiệu hóa');
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
    errorMessage.textContent = message;
    errorMessage.style.color = '#e74c3c';
    errorMessage.style.display = 'block';
}

function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = '#2ecc71';
    errorMessage.style.display = 'block';
} 