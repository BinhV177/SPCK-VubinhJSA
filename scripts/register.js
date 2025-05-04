import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Thêm vào đầu file
console.log("Register.js loading at:", new Date().toISOString());

// Theo dõi chuyển hướng
let isRedirecting = false;
const originalAssign = window.location.assign;
window.location.assign = function(url) {
    console.log("Redirecting to:", url);
    console.log("Redirect stack:", new Error().stack);
    isRedirecting = true;
    originalAssign.call(this, url);
};

const originalReplace = window.location.replace;
window.location.replace = function(url) {
    console.log("Replacing location with:", url);
    console.log("Replace stack:", new Error().stack);
    isRedirecting = true;
    originalReplace.call(this, url);
};

const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href');
Object.defineProperty(window.location, 'href', {
    set: function(url) {
        console.log("Setting location.href to:", url);
        console.log("Href stack:", new Error().stack);
        isRedirecting = true;
        originalHref.set.call(this, url);
    },
    get: function() {
        return originalHref.get.call(this);
    }
});

// Kiểm tra sau 1 giây xem có bị chuyển hướng không
setTimeout(() => {
    if (!isRedirecting) {
        console.log("No redirection detected after 1 second");
    }
}, 1000);

// Polyfill cho trình duyệt cũ
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                            Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("Register page loaded at:", new Date().toISOString());
  console.log("Current URL:", window.location.href);
  
  // Kiểm tra xem có đang tự động chuyển hướng không
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                    JSON.parse(sessionStorage.getItem('currentUser'));
  
  console.log("Current user:", currentUser);
  
  // Nếu đã đăng nhập và có code chuyển hướng, vô hiệu hóa nó
  if (currentUser) {
    console.log("User already logged in, but staying on register page");
  }
  
  // Thêm event listener để theo dõi chuyển hướng
  window.addEventListener('beforeunload', function(e) {
    console.log("Page is about to be unloaded");
  });
  
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

  // Thiết lập giá trị mặc định cho năm sinh
  if (yearInput) {
    const currentYear = new Date().getFullYear();
    yearInput.setAttribute('max', currentYear);
    yearInput.setAttribute('placeholder', 'Ví dụ: 1990');
  }

  // Xử lý kiểm tra số điện thoại - chỉ cho phép nhập số và kiểm tra độ dài
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      // Chỉ giữ lại các ký tự số trong input
      this.value = this.value.replace(/[^0-9+]/g, '');

      // Nếu không bắt đầu bằng 0 hoặc +84, đặt lại giá trị
      if (this.value && !this.value.startsWith('0') && !this.value.startsWith('+84')) {
        showError(phoneError, 'Số điện thoại phải bắt đầu bằng 0 hoặc +84');
      }
      // Kiểm tra độ dài số điện thoại
      else if (this.value.startsWith('+84') && this.value.length > 12) {
        this.value = this.value.slice(0, 12);
        showError(phoneError, 'Số điện thoại không được quá 10 chữ số (không kể +84)');
  }
      else if (this.value.startsWith('0') && this.value.length > 10) {
        this.value = this.value.slice(0, 10);
        showError(phoneError, 'Số điện thoại không được quá 10 chữ số');
      }
      else {
        phoneError.textContent = '';
      }
    });
  }

  // Xác thực ngày tháng khi người dùng thay đổi
  if (dayInput && monthInput && yearInput) {
    // Chỉ cho phép nhập số cho ngày
    dayInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
      const day = parseInt(this.value);

      if (day > 31) {
        this.value = '31';
        showError(birthdayError, 'Ngày không được lớn hơn 31');
      } else {
        birthdayError.textContent = '';
      }
    });

    // Chỉ cho phép nhập số cho tháng
    monthInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
      const month = parseInt(this.value);

      if (month > 12) {
        this.value = '12';
        showError(birthdayError, 'Tháng không được lớn hơn 12');
      } else {
        birthdayError.textContent = '';

        // Cập nhật giá trị tối đa cho ngày dựa trên tháng
        updateDaysInMonth();
  }
    });

    // Chỉ cho phép nhập số cho năm và giới hạn 4 chữ số
    yearInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
      if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
        showError(birthdayError, 'Năm không được quá 4 chữ số');
      } else {
        birthdayError.textContent = '';

        // Cập nhật lại số ngày nếu là tháng 2 (xử lý năm nhuận)
        if (parseInt(monthInput.value) === 2) {
          updateDaysInMonth();
        }
      }
    });

    // Hàm cập nhật số ngày trong tháng
    function updateDaysInMonth() {
      const month = parseInt(monthInput.value);
      const year = parseInt(yearInput.value) || new Date().getFullYear();
      const day = parseInt(dayInput.value);

      if (month === 2) {
        // Tháng 2
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        const maxDay = isLeapYear ? 29 : 28;

        if (day > maxDay) {
          dayInput.value = maxDay;
          showError(birthdayError, `Tháng 2 năm ${year} chỉ có ${maxDay} ngày`);
        }
      } else if ([4, 6, 9, 11].includes(month)) {
        // Tháng 4, 6, 9, 11 có 30 ngày
        if (day > 30) {
          dayInput.value = 30;
          showError(birthdayError, 'Tháng này chỉ có 30 ngày');
        }
      }
    }
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
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1000);
        } catch (error) {
          console.error("Lỗi khi lưu dữ liệu:", error);
          showNotification('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.', 'error');
        }
      }
    });
  }

  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to validate phone number
  function isValidPhone(phone) {
    // Loại bỏ tất cả ký tự không phải số
    const numericPhone = phone.replace(/\D/g, '');
    
    // Kiểm tra số điện thoại Việt Nam (bắt đầu bằng 0 hoặc +84, theo sau là 9 chữ số)
    if (phone.startsWith('0') && phone.length === 10) {
      // Kiểm tra đầu số hợp lệ của Việt Nam
      const validPrefixes = ['03', '05', '07', '08', '09'];
      const prefix = phone.substring(0, 2);
      return validPrefixes.includes(prefix);
    } else if (phone.startsWith('+84') && phone.length === 12) {
      // Kiểm tra +84 và 9 chữ số tiếp theo
      const validPrefixes = ['+843', '+845', '+847', '+848', '+849'];
      const prefix = phone.substring(0, 4);
      return validPrefixes.includes(prefix);
    }
    return false;
  }

  // Thêm kiểm tra số điện thoại khi nhập
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      // Chỉ giữ lại các ký tự số và dấu +
      this.value = this.value.replace(/[^\d+]/g, '');
      
      // Kiểm tra và hiển thị lỗi ngay khi nhập
      if (this.value && !this.value.startsWith('0') && !this.value.startsWith('+84')) {
        showError(phoneError, 'Số điện thoại phải bắt đầu bằng 0 hoặc +84');
      } else if (this.value.length > 0 && !isValidPhone(this.value)) {
        showError(phoneError, 'Số điện thoại không hợp lệ');
      } else {
        phoneError.textContent = '';
        phoneError.parentElement.classList.remove('has-error');
      }
    });
  }

  // Cải thiện kiểm tra email trùng lặp trong sự kiện submit form
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
        
        // Show success message
        showNotification('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...', 'success');
        
        // Đặt thời gian chuyển hướng ngắn hơn - 1 giây
        setTimeout(() => {
          // Trước khi chuyển hướng, lưu thông tin đăng nhập mới vào một biến tạm
          localStorage.setItem('newRegistration', JSON.stringify({
            email: email,
            registered: true
          }));
          
          // Chuyển hướng đến trang đăng nhập
          window.location.href = 'login.html';
        }, 1000);
      }
    });
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

      // Add CSS for notification container if it doesn't exist
      if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
          }

          .notification {
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            animation: slideInRight 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
            max-width: 350px;
          }

          .notification.success {
            background-color: #4caf50;
          }

          .notification.error {
            background-color: #f44336;
          }

          .notification.warning {
            background-color: #ff9800;
          }

          .notification i {
            margin-right: 10px;
            font-size: 1.2rem;
          }

          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }

          .has-error input, .has-error select {
            border-color: #f44336 !important;
      }

          .error-message {
            color: #f44336;
            font-size: 0.8rem;
            margin-top: 5px;
    }
        `;
        document.head.appendChild(style);
      }
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
  }
});

function redirectToLogin() {
  console.log("Redirecting to login page...");
  window.location.href = 'login.html';
}

// Thay đổi phần setTimeout trong xử lý form
setTimeout(() => {
  console.log("Timeout completed, redirecting now");
  redirectToLogin();
}, 1000);

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

