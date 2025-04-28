// Dữ liệu sản phẩm thời trang
const products = [
    // Thời trang nữ
    {
        id: 1,
        name: "Áo Blazer Nữ Công Sở",
        category: "women",
        subCategory: "blazers",
        price: 1590000,
        salePrice: null,
        description: "Áo blazer nữ phong cách công sở thanh lịch",
        images: ["./assets/blazernucongso.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Đen", "Be", "Xám"],
        inStock: true,
        isNew: true,
        isSale: false
    },
    {
        id: 2,
        name: "Váy Đầm Dự Tiệc",
        category: "women",
        subCategory: "dresses",
        price: 2190000,
        salePrice: 1890000,
        description: "Váy đầm dự tiệc sang trọng, thiết kế hiện đại",
        images: ["./assets/thoitrangnu.jpg"],
        sizes: ["S", "M", "L"],
        colors: ["Đỏ", "Đen", "Trắng"],
        inStock: true,
        isNew: true,
        isSale: true
    },
    {
        id: 3,
        name: "Áo Sơ Mi Nữ Công Sở",
        category: "women",
        subCategory: "shirts",
        price: 590000,
        salePrice: null,
        description: "Áo sơ mi nữ chất liệu lụa cao cấp",
        images: ["./assets/thoitrangnu.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Trắng", "Hồng nhạt", "Xanh nhạt"],
        inStock: true,
        isNew: false,
        isSale: false
    },
    {
        id: 4,
        name: "Quần Âu Nữ",
        category: "women",
        subCategory: "pants",
        price: 790000,
        salePrice: 690000,
        description: "Quần âu nữ công sở, form chuẩn",
        images: ["./assets/thoitrangnu.jpg"],
        sizes: ["S", "M", "L"],
        colors: ["Đen", "Xám", "Xanh đen"],
        inStock: true,
        isNew: false,
        isSale: true
    },

    // Thời trang nam
    {
        id: 5,
        name: "Áo Sơ Mi Nam Công Sở",
        category: "men",
        subCategory: "shirts",
        price: 690000,
        salePrice: null,
        description: "Áo sơ mi nam chất liệu cotton cao cấp",
        images: ["./assets/thoitrangnam.jpg"],
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Trắng", "Xanh nhạt", "Ghi"],
        inStock: true,
        isNew: true,
        isSale: false
    },
    {
        id: 6,
        name: "Quần Jean Nam Slim Fit",
        category: "men",
        subCategory: "jeans",
        price: 890000,
        salePrice: 690000,
        description: "Quần jean nam form slim fit năng động",
        images: ["./assets/thoitrangnam.jpg"],
        sizes: ["29", "30", "31", "32", "33"],
        colors: ["Xanh đậm", "Xanh nhạt"],
        inStock: true,
        isNew: true,
        isSale: true
    },
    {
        id: 7,
        name: "Áo Polo Nam",
        category: "men",
        subCategory: "tshirts",
        price: 490000,
        salePrice: null,
        description: "Áo polo nam thiết kế basic, dễ phối đồ",
        images: ["./assets/thoitrangnam.jpg"],
        sizes: ["M", "L", "XL"],
        colors: ["Đen", "Trắng", "Xanh navy"],
        inStock: true,
        isNew: true,
        isSale: false
    },
    {
        id: 8,
        name: "Quần Tây Nam",
        category: "men",
        subCategory: "pants",
        price: 790000,
        salePrice: 690000,
        description: "Quần tây nam công sở cao cấp",
        images: ["./assets/thoitrangnam.jpg"],
        sizes: ["29", "30", "31", "32"],
        colors: ["Đen", "Xám", "Xanh đen"],
        inStock: true,
        isNew: false,
        isSale: true
    }
];

// Dữ liệu danh mục chi tiết
const categories = {
    women: {
        name: "Thời trang nữ",
        subcategories: {
            dresses: {
                name: "Đầm",
                types: ["Đầm công sở", "Đầm dự tiệc", "Đầm suông", "Đầm maxi"]
            },
            blazers: {
                name: "Áo blazer",
                types: ["Blazer dài", "Blazer ngắn", "Blazer công sở"]
            },
            shirts: {
                name: "Áo sơ mi",
                types: ["Sơ mi công sở", "Sơ mi cách điệu", "Sơ mi lụa"]
            },
            tshirts: {
                name: "Áo thun",
                types: ["Áo thun basic", "Áo thun in họa tiết", "Áo polo"]
            },
            pants: {
                name: "Quần",
                types: ["Quần âu", "Quần jean", "Quần short"]
            },
            skirts: {
                name: "Chân váy",
                types: ["Chân váy xòe", "Chân váy bút chì", "Chân váy jean"]
            }
        }
    },
    men: {
        name: "Thời trang nam",
        subcategories: {
            shirts: {
                name: "Áo sơ mi",
                types: ["Sơ mi công sở", "Sơ mi casual", "Sơ mi ngắn tay"]
            },
            tshirts: {
                name: "Áo thun",
                types: ["Áo thun basic", "Áo polo", "Áo thun in họa tiết"]
            },
            jeans: {
                name: "Quần jean",
                types: ["Jean slim fit", "Jean regular fit", "Jean skinny"]
            },
            pants: {
                name: "Quần tây",
                types: ["Quần âu", "Quần kaki", "Quần tây công sở"]
            },
            jackets: {
                name: "Áo khoác",
                types: ["Áo khoác dù", "Áo khoác jean", "Áo blazer"]
            }
        }
    }
};

// API Class
class FashionAPI {
    // Lấy tất cả sản phẩm
    static async getAllProducts() {
        try {
            return products;
        } catch (error) {
            throw new Error('Không thể lấy danh sách sản phẩm');
        }
    }

    // Lấy sản phẩm theo ID
    static async getProductById(id) {
        try {
            const product = products.find(p => p.id === id);
            if (!product) throw new Error('Không tìm thấy sản phẩm');
            return product;
        } catch (error) {
            throw new Error('Không thể lấy thông tin sản phẩm');
        }
    }

    // Lấy sản phẩm theo danh mục
    static async getProductsByCategory(category, subcategory = null) {
        try {
            let filteredProducts = products.filter(p => p.category === category);
            if (subcategory) {
                filteredProducts = filteredProducts.filter(p => p.subCategory === subcategory);
            }
            return filteredProducts;
        } catch (error) {
            throw new Error('Không thể lọc sản phẩm theo danh mục');
        }
    }

    // Lấy sản phẩm mới
    static async getNewProducts() {
        try {
            return products.filter(p => p.isNew);
        } catch (error) {
            throw new Error('Không thể lấy sản phẩm mới');
        }
    }

    // Lấy sản phẩm đang sale
    static async getSaleProducts() {
        try {
            return products.filter(p => p.isSale);
        } catch (error) {
            throw new Error('Không thể lấy sản phẩm giảm giá');
        }
    }

    // Tìm kiếm sản phẩm
    static async searchProducts(query) {
        try {
            const searchQuery = query.toLowerCase();
            return products.filter(p => 
                p.name.toLowerCase().includes(searchQuery) ||
                p.description.toLowerCase().includes(searchQuery)
            );
        } catch (error) {
            throw new Error('Không thể tìm kiếm sản phẩm');
        }
    }

    // Lấy danh mục
    static async getCategories() {
        try {
            return categories;
        } catch (error) {
            throw new Error('Không thể lấy danh mục');
        }
    }

    // Lọc sản phẩm theo giá
    static async filterByPrice(minPrice, maxPrice) {
        try {
            return products.filter(p => {
                const price = p.salePrice || p.price;
                return price >= minPrice && price <= maxPrice;
            });
        } catch (error) {
            throw new Error('Không thể lọc sản phẩm theo giá');
        }
    }
}

export default FashionAPI;