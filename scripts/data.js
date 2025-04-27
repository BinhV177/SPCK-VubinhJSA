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
    
    // Xuất dữ liệu ra console để kiểm tra
    console.log('Danh sách users sau khi thêm:', getAllUsers());
};

// Kiểm tra email đã tồn tại
const isEmailExists = (email) => {
    const users = getAllUsers();
    return users.some(user => user.email === email);
};

// Export các hàm để sử dụng
export { initializeData, getAllUsers, addUser, isEmailExists }; 