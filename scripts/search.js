document.addEventListener('DOMContentLoaded', function() {
    // Xử lý hiển thị form tìm kiếm
    const searchIcon = document.getElementById('searchIcon');
    const headerSearchForm = document.getElementById('headerSearchForm');
    
    if (searchIcon && headerSearchForm) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            headerSearchForm.classList.toggle('active');
            document.getElementById('headerSearchInput').focus();
        });
        
        // Đóng form tìm kiếm khi click ra ngoài
        document.addEventListener('click', function(e) {
            if (!headerSearchForm.contains(e.target) && e.target !== searchIcon) {
                headerSearchForm.classList.remove('active');
            }
        });
        
        // Xử lý submit form tìm kiếm
        headerSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = document.getElementById('headerSearchInput').value.trim();
            
            if (searchTerm) {
                window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
});