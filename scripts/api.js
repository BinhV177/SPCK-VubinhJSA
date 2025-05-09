// Dữ liệu sản phẩm thời trang
const products = [
    // Thời trang nữ
    {
        id: 1,
        name: "Áo Blazer Nữ Công Sở",
        category: "women",
        subCategory: "blazer",
        price: 1590000,
        salePrice: null,
        description: "Áo blazer nữ phong cách công sở thanh lịch",
        images: ["./assets/women/blazer-nu-1.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["den", "be", "xam"],
        inStock: true,
        isNew: true,
        isSale: false
    },
    {
        id: 2,
        name: "Váy Đầm Dự Tiệc",
        category: "women",
        subCategory: "dress",
        price: 2190000,
        salePrice: 1890000,
        description: "Váy đầm dự tiệc sang trọng, thiết kế hiện đại",
        images: ["./assets/women/vay-dam-1.jpg"],
        sizes: ["S", "M", "L"],
        colors: ["do", "den", "trang"],
        inStock: true,
        isNew: true,
        isSale: true
    },
    {
        id: 3,
        name: "Áo Sơ Mi Nữ Công Sở",
        category: "women",
        subCategory: "shirt",
        price: 590000,
        salePrice: null,
        description: "Áo sơ mi nữ kiểu dáng thanh lịch, phù hợp môi trường công sở",
        images: ["./assets/women/ao-so-mi-1.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["trang", "xanh", "hong"],
        inStock: true,
        isNew: false,
        isSale: false
    },
    {
        id: 4,
        name: "Quần Âu Nữ",
        category: "women",
        subCategory: "pants",
        price: 890000,
        salePrice: 690000,
        description: "Quần âu nữ dáng suông, chất liệu cao cấp",
        images: ["./assets/women/quan-au-1.jpg"],
        sizes: ["S", "M", "L"],
        colors: ["den", "xam", "xanh"],
        inStock: true,
        isNew: false,
        isSale: true
    },
    {
        id: 5,
        name: "Chân Váy Xếp Ly",
        category: "women",
        subCategory: "skirt",
        price: 790000,
        salePrice: null,
        description: "Chân váy xếp ly thanh lịch, dễ phối đồ",
        images: ["./assets/women/chan-vay-1.jpg"],
        sizes: ["S", "M", "L"],
        colors: ["den", "xam", "be"],
        inStock: true,
        isNew: false,
        isSale: false
    },
    {
        id: 7,
        name: "Áo Thun Nữ Basic",
        category: "women",
        subCategory: "shirt",
        price: 590000,
        salePrice: 490000,
        description: "Áo thun nữ basic, chất liệu cotton thoáng mát",
        images: ["./assets/women/ao-thun-1.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["trang", "den", "xanh", "hong"],
        inStock: true,
        isNew: false,
        isSale: true
    },
    // Thêm sản phẩm nữ mới
    {
        id: 11,
        name: "Đầm Suông Thanh Lịch",
        category: "women",
        subCategory: "dress",
        price: 1290000,
        salePrice: null,
        description: "Đầm suông thanh lịch, phù hợp cho nhiều dịp khác nhau",
        images: ["./assets/women/vay-dam-3.jpg"],
        sizes: ["S", "M", "L"],
        colors: ["xanh", "be", "hong"],
        inStock: true,
        isNew: true,
        isSale: false
    },
    {
        id: 12,
        name: "Áo Sơ Mi Nữ Cách Điệu",
        category: "women",
        subCategory: "shirt",
        price: 740000,
        salePrice: 590000,
        description: "Áo sơ mi nữ cách điệu, thiết kế hiện đại",
        images: ["./assets/women/ao-so-mi-2.jpg"],
        sizes: ["S", "M", "L"],
        colors: ["trang", "hong", "xanh"],
        inStock: true,
        isNew: false,
        isSale: true
    },
    
    // Thời trang nam
    {
        id: 101,
        name: "Bộ Vest Nam Công Sở",
        category: "men",
        subCategory: "suit",
        price: 1890000,
        salePrice: null,
        description: "Bộ vest nam công sở, thiết kế hiện đại, lịch lãm",
        images: ["./assets/vest-nam-1.jpg"],
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["den", "xam", "xanh"],
        inStock: true,
        isNew: true,
        isSale: false
    },
    {
        id: 103,
        name: "Áo Sơ Mi Nam Công Sở",
        category: "men",
        subCategory: "shirt",
        price: 650000,
        salePrice: null,
        description: "Áo sơ mi nam công sở, chất liệu cao cấp",
        images: ["./assets/ao-so-mi-nam-1.jpg"],
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["trang", "xanh", "den"],
        inStock: true,
        isNew: false,
        isSale: false
    },
    {
        id: 105,
        name: "Áo Polo Nam Basic",
        category: "men",
        subCategory: "polo",
        price: 500000,
        salePrice: 450000,
        description: "Áo polo nam basic, chất liệu cotton thoáng mát",
        images: ["./assets/ao-polo-1.jpg"],
        sizes: ["M", "L", "XL"],
        colors: ["den", "trang", "xanh", "do"],
        inStock: true,
        isNew: false,
        isSale: true
    },
    // Thêm sản phẩm nam mới
    {
        id: 111,
        name: "Áo Thun Nam Họa Tiết",
        category: "men",
        subCategory: "tshirt",
        price: 790000,
        salePrice: null,
        description: "Áo thun nam họa tiết hiện đại, trẻ trung",
        images: ["./assets/men/ao-thun-1.jpg"],
        sizes: ["M", "L", "XL"],
        colors: ["den", "trang", "xanh"],
        inStock: true,
        isNew: true,
        isSale: false
    },
    {
        id: 112,
        name: "Quần Kaki Nam Slim Fit",
        category: "men",
        subCategory: "pants",
        price: 1190000,
        salePrice: null,
        description: "Quần kaki nam dáng slim fit, chất liệu cao cấp",
        images: ["./assets/men/quan-kaki-1.jpg"],
        sizes: ["29", "30", "31", "32", "33"],
        colors: ["be", "xam", "den"],
        inStock: true,
        isNew: false,
        isSale: false
    },
    {
        id: 113,
        name: "Bộ Vest Nam Cao Cấp",
        category: "men",
        subCategory: "suit",
        price: 2790000,
        salePrice: 2490000,
        description: "Bộ vest nam cao cấp, thiết kế sang trọng, lịch lãm",
        images: ["./assets/men/vest-nam-2.jpg"],
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["den", "xanh", "xam"],
        inStock: true,
        isNew: false,
        isSale: true
    },
    
    // Phụ kiện
    {
        id: 201,
        name: "Túi Xách Nữ Thời Trang",
        category: "accessories",
        subCategory: "bag",
        price: 1290000,
        salePrice: null,
        description: "Túi xách nữ thời trang, thiết kế hiện đại",
        images: ["./assets/accessories/tui-xach-1.jpg"],
        sizes: ["One size"],
        colors: ["den", "be", "do"],
        inStock: true,
        isNew: true,
        isSale: false
    },
    // Thêm phụ kiện mới
    {
        id: 202,
        name: "Ví Da Nam Cao Cấp",
        category: "accessories",
        subCategory: "wallet",
        price: 890000,
        salePrice: null,
        description: "Ví da nam cao cấp, thiết kế sang trọng",
        images: ["./assets/accessories/vi-da-1.jpg"],
        sizes: ["One size"],
        colors: ["den", "nau"],
        inStock: true,
        isNew: false,
        isSale: false
    },
    {
        id: 203,
        name: "Thắt Lưng Da Nam",
        category: "accessories",
        subCategory: "belt",
        price: 690000,
        salePrice: 590000,
        description: "Thắt lưng da nam cao cấp, thiết kế thanh lịch",
        images: ["./assets/accessories/that-lung-1.jpg"],
        sizes: ["One size"],
        colors: ["den", "nau"],
        inStock: true,
        isNew: false,
        isSale: true
    },
    {
        id: 204,
        name: "Đồng Hồ Nam Thời Trang",
        category: "accessories",
        subCategory: "watch",
        price: 1290000,
        salePrice: null,
        description: "Đồng hồ nam thời trang, thiết kế sang trọng",
        images: ["./assets/accessories/dong-ho-1.jpg"],
        sizes: ["One size"],
        colors: ["den", "bac"],
        inStock: true,
        isNew: true,
        isSale: false
    }
];

// API giả lập
class FashionAPI {
    // Lấy tất cả sản phẩm
    static getAllProducts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(products);
            }, 500);
        });
    }
    
    // Lấy sản phẩm theo ID
    static getProductById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const product = products.find(p => p.id === id);
                if (product) {
                    resolve(product);
                } else {
                    reject(new Error('Không tìm thấy sản phẩm'));
                }
            }, 300);
        });
    }
    
    // Lấy sản phẩm theo danh mục
    static getProductsByCategory(category) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filteredProducts = products.filter(p => p.category === category);
                resolve(filteredProducts);
            }, 300);
        });
    }
    
    // Lấy sản phẩm mới
    static getNewProducts(limit = 8) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProducts = products.filter(p => p.isNew).slice(0, limit);
                resolve(newProducts);
            }, 300);
        });
    }
    
    // Lấy sản phẩm đang sale
    static getSaleProducts(limit = 8) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const saleProducts = products.filter(p => p.isSale).slice(0, limit);
                resolve(saleProducts);
            }, 300);
        });
    }
}

export default FashionAPI;
