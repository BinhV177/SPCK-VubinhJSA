// Mô phỏng API cho trang web thời trang
class FashionAPI {
    // Lấy tất cả sản phẩm
    static async getAllProducts() {
        // Kết hợp sản phẩm từ tất cả các danh mục
        const womenProducts = await this.getWomenProducts();
        const menProducts = await this.getMenProducts();
        const accessoriesProducts = await this.getAccessoriesProducts();
        
        return [...womenProducts, ...menProducts, ...accessoriesProducts];
    }
    
    // Lấy sản phẩm theo ID
    static async getProductById(id) {
        const allProducts = await this.getAllProducts();
        return allProducts.find(product => product.id === id) || null;
    }
    
    // Lấy sản phẩm mới
    static async getNewProducts() {
        const allProducts = await this.getAllProducts();
        return allProducts.filter(product => product.isNew);
    }
    
    // Lấy sản phẩm giảm giá
    static async getSaleProducts() {
        const allProducts = await this.getAllProducts();
        return allProducts.filter(product => product.salePrice);
    }
    
    // Lấy sản phẩm nữ
    static async getWomenProducts() {
        return [
            {
                id: 1,
                name: "Đầm Maxi Hoa",
                price: 1290000,
                salePrice: 990000,
                category: "women",
                subCategory: "dress",
                isNew: true,
                colors: ["đỏ", "xanh", "trắng"],
                sizes: ["S", "M", "L", "XL"],
                images: ["./assets/products/women/dress1.jpg"],
                description: "Đầm maxi họa tiết hoa nhẹ nhàng, phù hợp cho mùa hè."
            },
            {
                id: 2,
                name: "Áo Sơ Mi Lụa",
                price: 850000,
                category: "women",
                subCategory: "shirt",
                isNew: true,
                colors: ["trắng", "be", "hồng nhạt"],
                sizes: ["S", "M", "L"],
                images: ["./assets/products/women/shirt1.jpg"],
                description: "Áo sơ mi lụa cao cấp, thiết kế thanh lịch phù hợp công sở."
            },
            {
                id: 3,
                name: "Quần Jeans Ống Rộng",
                price: 950000,
                salePrice: 750000,
                category: "women",
                subCategory: "jeans",
                isNew: false,
                colors: ["xanh đậm", "xanh nhạt", "đen"],
                sizes: ["S", "M", "L", "XL"],
                images: ["./assets/products/women/jeans1.jpg"],
                description: "Quần jeans ống rộng thời trang, phong cách retro."
            },
            {
                id: 4,
                name: "Áo Khoác Denim",
                price: 1450000,
                category: "women",
                subCategory: "jacket",
                isNew: false,
                colors: ["xanh", "đen"],
                sizes: ["S", "M", "L"],
                images: ["./assets/products/women/jacket1.jpg"],
                description: "Áo khoác denim phong cách, dễ phối đồ."
            },
            {
                id: 5,
                name: "Chân Váy Xếp Ly",
                price: 650000,
                category: "women",
                subCategory: "skirt",
                isNew: true,
                colors: ["đen", "be", "xanh navy"],
                sizes: ["S", "M", "L"],
                images: ["./assets/products/women/skirt1.jpg"],
                description: "Chân váy xếp ly thanh lịch, phù hợp nhiều dịp."
            },
            {
                id: 6,
                name: "Áo Thun Basic",
                price: 350000,
                salePrice: 290000,
                category: "women",
                subCategory: "tshirt",
                isNew: false,
                colors: ["trắng", "đen", "xám", "hồng"],
                sizes: ["S", "M", "L", "XL"],
                images: ["./assets/products/women/tshirt1.jpg"],
                description: "Áo thun basic chất liệu cotton cao cấp, thoáng mát."
            }
        ];
    }
    
    // Lấy sản phẩm nam
    static async getMenProducts() {
        return [
            {
                id: 101,
                name: "Áo Sơ Mi Kẻ Sọc",
                price: 890000,
                category: "men",
                subCategory: "shirt",
                isNew: true,
                colors: ["xanh", "trắng", "xám"],
                sizes: ["M", "L", "XL", "XXL"],
                images: ["./assets/products/men/shirt1.jpg"],
                description: "Áo sơ mi kẻ sọc thanh lịch, phù hợp công sở và các dịp quan trọng."
            },
            {
                id: 102,
                name: "Quần Kaki Slim Fit",
                price: 750000,
                salePrice: 650000,
                category: "men",
                subCategory: "pants",
                isNew: false,
                colors: ["be", "xanh navy", "đen"],
                sizes: ["30", "31", "32", "33", "34"],
                images: ["./assets/products/men/pants1.jpg"],
                description: "Quần kaki slim fit thoải mái, dễ phối đồ."
            },
            {
                id: 103,
                name: "Áo Thun Polo",
                price: 450000,
                category: "men",
                subCategory: "tshirt",
                isNew: true,
                colors: ["đen", "trắng", "xanh", "đỏ"],
                sizes: ["M", "L", "XL", "XXL"],
                images: ["./assets/products/men/tshirt1.jpg"],
                description: "Áo thun polo chất liệu cotton cao cấp, thiết kế lịch lãm."
            },
            {
                id: 104,
                name: "Áo Khoác Bomber",
                price: 1250000,
                salePrice: 990000,
                category: "men",
                subCategory: "jacket",
                isNew: false,
                colors: ["đen", "xanh navy"],
                sizes: ["M", "L", "XL"],
                images: ["./assets/products/men/jacket1.jpg"],
                description: "Áo khoác bomber phong cách, chống gió tốt."
            },
            {
                id: 105,
                name: "Quần Jeans Slim",
                price: 850000,
                category: "men",
                subCategory: "jeans",
                isNew: true,
                colors: ["xanh đậm", "xanh nhạt", "đen"],
                sizes: ["30", "31", "32", "33", "34"],
                images: ["./assets/products/men/jeans1.jpg"],
                description: "Quần jeans slim fit, tôn dáng người mặc."
            },
            {
                id: 106,
                name: "Áo Vest Công Sở",
                price: 1950000,
                category: "men",
                subCategory: "blazer",
                isNew: false,
                colors: ["đen", "xanh navy", "xám"],
                sizes: ["M", "L", "XL", "XXL"],
                images: ["./assets/products/men/blazer1.jpg"],
                description: "Áo vest công sở thiết kế hiện đại, lịch lãm."
            }
        ];
    }
    
    // Lấy sản phẩm phụ kiện
    static async getAccessoriesProducts() {
        return [
            {
                id: 201,
                name: "Túi Xách Tay Nữ",
                price: 1290000,
                salePrice: 990000,
                category: "accessories",
                subCategory: "bag",
                isNew: true,
                colors: ["đen", "be", "đỏ"],
                sizes: [""],
                images: ["./assets/products/accessories/bag1.jpg"],
                description: "Túi xách tay nữ thiết kế thanh lịch, chất liệu da cao cấp."
            },
            {
                id: 202,
                name: "Dây Chuyền Bạc",
                price: 750000,
                category: "accessories",
                subCategory: "jewelry",
                isNew: false,
                colors: ["bạc"],
                sizes: [""],
                images: ["./assets/products/accessories/necklace1.jpg"],
                description: "Dây chuyền bạc 925 thiết kế tinh tế, sang trọng."
            },
            {
                id: 203,
                name: "Mũ Bucket",
                price: 350000,
                category: "accessories",
                subCategory: "hat",
                isNew: true,
                colors: ["đen", "be", "trắng"],
                sizes: ["free size"],
                images: ["./assets/products/accessories/hat1.jpg"],
                description: "Mũ bucket phong cách, dễ phối đồ."
            },
            {
                id: 204,
                name: "Thắt Lưng Da Nam",
                price: 650000,
                salePrice: 550000,
                category: "accessories",
                subCategory: "belt",
                isNew: false,
                colors: ["đen", "nâu"],
                sizes: ["105cm", "110cm", "115cm"],
                images: ["./assets/products/accessories/belt1.jpg"],
                description: "Thắt lưng da bò thật, thiết kế lịch lãm."
            },
            {
                id: 205,
                name: "Kính Mát Thời Trang",
                price: 550000,
                category: "accessories",
                subCategory: "glasses",
                isNew: true,
                colors: ["đen", "nâu", "xanh"],
                sizes: ["free size"],
                images: ["./assets/products/accessories/glasses1.jpg"],
                description: "Kính mát thời trang, chống tia UV."
            },
            {
                id: 206,
                name: "Khăn Choàng Cổ",
                price: 450000,
                salePrice: 350000,
                category: "accessories",
                subCategory: "scarf",
                isNew: false,
                colors: ["xám", "be", "đen"],
                sizes: ["free size"],
                images: ["./assets/products/accessories/scarf1.jpg"],
                description: "Khăn choàng cổ chất liệu len mềm mại, giữ ấm tốt."
            }
        ];
    }
}

export default FashionAPI;
