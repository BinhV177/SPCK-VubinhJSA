// Thay thế dòng import Firebase
// import { auth, db } from './firebase-config.js';

// Với biến giả để tránh lỗi
const auth = { currentUser: null };
const db = {};

document.addEventListener('DOMContentLoaded', () => {
  console.log("Login page loaded");
  
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberMeCheckbox = document.getElementById('remember-me');
  const togglePassword = document.querySelector('.toggle-password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  
  // Kiểm tra xem có phải người dùng vừa đăng ký không
  try {
    const newRegistration = JSON.parse(localStorage.getItem('newRegistration'));
    console.log("New registration data:", newRegistration);
    
    if (newRegistration && newRegistration.registered) {
      console.log("Found new registration");
      
      // Tự động điền email
      if (emailInput) {
        emailInput.value = newRegistration.email;
        console.log("Auto-filled email:", newRegistration.email);
        
        // Focus vào ô mật khẩu để người dùng có thể nhập ngay
        if (passwordInput) {
          passwordInput.focus();
        }
      }
      
      // Hiển thị thông báo
      showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
      
      // Xóa thông tin đăng ký tạm thời
      localStorage.removeItem('newRegistration');
    }
  } catch (error) {
    console.error("Error processing registration data:", error);
  }
  
  // Xử lý hiện/ẩn mật khẩu
  if (togglePassword) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }
  
  // Xử lý đăng nhập
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset error messages
      resetErrors();
      
      // Get input values
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;
      
      // Validate inputs
      let isValid = true;
      
      if (!email) {
        showError(emailError, 'Vui lòng nhập email');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError(emailError, 'Email không hợp lệ');
        isValid = false;
      }
      
      if (!password) {
        showError(passwordError, 'Vui lòng nhập mật khẩu');
        isValid = false;
      }
      
      if (isValid) {
        // Kiểm tra đăng nhập với localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
          // Save current user info
          const currentUser = {
            username: user.username,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            birthday: user.birthday,
            isLoggedIn: true
          };
          
          if (rememberMe) {
            // Lưu vào localStorage nếu chọn "Ghi nhớ đăng nhập"
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          } else {
            // Lưu vào sessionStorage nếu không chọn "Ghi nhớ đăng nhập"
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
          
          // Show success message
          showNotification('Đăng nhập thành công!', 'success');
          
          // Redirect to home page after 1 second
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          showError(emailError, 'Email hoặc mật khẩu không đúng');
          showError(passwordError, 'Email hoặc mật khẩu không đúng');
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
  // Check if notification container exists
  let notificationContainer = document.querySelector('.notification-container');

  // If not, create it
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }

  // Create notification element
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
  }

  notification.innerHTML = `${icon}${message}`;
  notificationContainer.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
  };
