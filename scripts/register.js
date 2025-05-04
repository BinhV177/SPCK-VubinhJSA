// Thay thế các dòng import Firebase
// import { auth, db } from './firebase-config.js';
// import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Với biến giả để tránh lỗi
const auth = { currentUser: null };
const db = {};

// Sử dụng cách an toàn hơn để theo dõi chuyển hướng
console.log("Register.js loading at:", new Date().toISOString());

document.addEventListener('DOMContentLoaded', () => {
  console.log("Register page loaded at:", new Date().toISOString());
  console.log("Current URL:", window.location.href);
  
  // Khai báo các biến DOM elements
  const registerForm = document.getElementById('registerForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const phoneInput = document.getElementById('phone');
  const dayInput = document.getElementById('day');
  const monthInput = document.getElementById('month');
  const yearInput = document.getElementById('year');
  const termsCheckbox = document.getElementById('terms');
  const togglePassword = document.querySelector('.toggle-password');

  // Get error elements
  const usernameError = document.getElementById('username-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const phoneError = document.getElementById('phone-error');
  const birthdayError = document.getElementById('birthday-error');
  const termsError = document.getElementById('terms-error');

  // Xử lý đăng ký
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset error messages
      resetErrors();
      
      // Get form values
      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const phone = phoneInput.value.trim();
      const gender = document.querySelector('input[name="gender"]:checked')?.value;
      const day = dayInput.value ? dayInput.value.toString().padStart(2, '0') : '';
      const month = monthInput.value ? monthInput.value.toString().padStart(2, '0') : '';
      const year = yearInput.value;
      const termsAccepted = termsCheckbox.checked;
      
      // Validate inputs
      let isValid = true;
      
      // Username validation
      if (!username) {
        showError(usernameError, 'Vui lòng nhập tên đăng nhập');
        isValid = false;
      } else if (username.length < 3) {
        showError(usernameError, 'Tên đăng nhập phải có ít nhất 3 ký tự');
        isValid = false;
      }
      
      // Email validation
      if (!email) {
        showError(emailError, 'Vui lòng nhập email');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError(emailError, 'Email không hợp lệ');
        isValid = false;
      }
      
      // Password validation
      if (!password) {
        showError(passwordError, 'Vui lòng nhập mật khẩu');
        isValid = false;
      } else if (password.length < 6) {
        showError(passwordError, 'Mật khẩu phải có ít nhất 6 ký tự');
        isValid = false;
      }
      
      // Phone validation
      if (!phone) {
        showError(phoneError, 'Vui lòng nhập số điện thoại');
        isValid = false;
      } else if (!isValidPhone(phone)) {
        showError(phoneError, 'Số điện thoại không hợp lệ');
        isValid = false;
      }
      
      // Gender validation
      if (!gender) {
        showError(document.getElementById('gender-error'), 'Vui lòng chọn giới tính');
        isValid = false;
      }
      
      // Birthday validation
      if (!day || !month || !year) {
        showError(birthdayError, 'Vui lòng nhập đầy đủ ngày sinh');
        isValid = false;
      }
      
      // Terms validation
      if (!termsAccepted) {
        showError(termsError, 'Bạn phải đồng ý với điều khoản sử dụng');
        isValid = false;
      }
      
      if (isValid) {
        // Kiểm tra xem email đã tồn tại chưa
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (emailExists) {
          showError(emailError, 'Email này đã được đăng ký. Vui lòng sử dụng email khác.');
          return;
        }
        
        try {
          // Create user object
          const user = {
            username,
            email,
            password,
            phone,
            gender,
            birthday: `${day}/${month}/${year}`,
            registeredAt: new Date().toISOString()
          };
          
          // Save to localStorage
          users.push(user);
          localStorage.setItem('users', JSON.stringify(users));
          
          // Lưu thông tin đăng nhập mới vào localStorage để trang login có thể sử dụng
          const newRegistration = {
            email: email,
            registered: true
          };
          localStorage.setItem('newRegistration', JSON.stringify(newRegistration));
          
          console.log("Đăng ký thành công, đã lưu thông tin:", user);
          console.log("Đã lưu newRegistration:", newRegistration);
          
          // Show success message
          showNotification('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...', 'success');
          
          // Chuyển hướng đến trang đăng nhập sau 1 giây
          setTimeout(function() {
            console.log("Redirecting to login page...");
            window.location.href = 'login.html';
          }, 1000);
        } catch (error) {
          console.error("Lỗi khi lưu dữ liệu:", error);
          showNotification('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.', 'error');
        }
      }
    });
  }
});

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate phone number
function isValidPhone(phone) {
  // Kiểm tra số điện thoại Việt Nam
  if (phone.startsWith('+84')) {
    return phone.length === 12 && /^\+84\d{9}$/.test(phone);
  } else if (phone.startsWith('0')) {
    return phone.length === 10 && /^0\d{9}$/.test(phone);
  }
  return false;
}

// Helper function to show error messages
function showError(element, message) {
  if (element) {
    element.textContent = message;
    element.parentElement.classList.add('has-error');
  }
}

// Helper function to reset error messages
function resetErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
    if (element.parentElement) {
      element.parentElement.classList.remove('has-error');
    }
  });
}

// Function to show notification
function showNotification(message, type) {
  // Implement notification function
  console.log(`${type}: ${message}`);
  // Thêm code hiển thị thông báo trên UI
}

// Thêm hàm đăng ký với Firebase (nếu bạn muốn sử dụng)
async function registerWithFirebase(email, password, userData) {
  try {
    // Tạo tài khoản với Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Lưu thông tin bổ sung vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: userData.username,
      phone: userData.phone,
      gender: userData.gender,
      birthday: userData.birthday,
      registeredAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("Firebase registration error:", error);
    return false;
  }
}

