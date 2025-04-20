import FashionAPI from './api.js';

// Hiển thị sản phẩm
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="wishlist-btn"><i class="fas fa-heart"></i></button>
                    <button class="add-to-cart-btn">Thêm vào giỏ</button>
                    <button class="quick-view-btn"><i class="fas fa-eye"></i></button>
                </div>
                ${product.isSale ? '<span class="sale-badge">Sale</span>' : ''}
                ${product.isNew ? '<span class="new-badge">New</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">
                    ${product.salePrice ? 
                        `<span class="sale-price">${formatPrice(product.salePrice)}₫</span>
                         <span class="original-price">${formatPrice(product.price)}₫</span>` 
                        : `${formatPrice(product.price)}₫`
                    }
                </p>
            </div>
        </div>
    `).join('');
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Xử lý tìm kiếm
async function handleSearch(query) {
    try {
        const searchResults = await FashionAPI.searchProducts(query);
        displaySearchResults(searchResults);
    } catch (error) {
        console.error('Lỗi tìm kiếm:', error);
    }
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(results) {
    const searchResultsContainer = document.querySelector('.search-results');
    if (!searchResultsContainer) return;

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>Không tìm thấy sản phẩm nào</p>';
        return;
    }

    searchResultsContainer.innerHTML = results.map(product => `
        <div class="search-result-item">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <p>${formatPrice(product.price)}₫</p>
            </div>
        </div>
    `).join('');
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Hiển thị sản phẩm mới
        const newProducts = await FashionAPI.getNewProducts();
        displayProducts(newProducts);

        // Xử lý tìm kiếm
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    handleSearch(e.target.value);
                }, 300);
            });
        }

        // Xử lý click vào sản phẩm
        document.querySelector('.product-grid')?.addEventListener('click', async (e) => {
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;

            const productId = parseInt(productCard.dataset.id);
            try {
                const product = await FashionAPI.getProductById(productId);
                // Hiển thị modal chi tiết sản phẩm
                showProductDetail(product);
            } catch (error) {
                console.error('Lỗi lấy chi tiết sản phẩm:', error);
            }
        });

    } catch (error) {
        console.error('Lỗi khởi tạo trang:', error);
    }
}); 