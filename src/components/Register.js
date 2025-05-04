const handleSubmit = async (e) => {
  e.preventDefault();
  // Validation logic here
  
  try {
    const response = await axios.post('/api/register', formData);
    if (response.data.success) {
      alert('Đăng ký thành công!');
      navigate('/login'); // Chuyển hướng đến trang đăng nhập
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};