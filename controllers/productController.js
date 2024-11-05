const pool = require('../config/database');
const productService = require('../services/productService');


// Hiển thị tất cả sản phẩm cùng với hình ảnh
const getproduct = async (req, res) => {
    try {
        const products = await productService.getAllProducts(); // Sử dụng hàm từ service
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
// Hiển thị sản phẩm theo SanPhamId
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy SanPhamId từ tham số URL
        const product = await productService.getProductById(id); // Gọi hàm từ service
        res.status(200).json(product); // Trả về dữ liệu sản phẩm
    } catch (error) {
        return res.status(404).json({ error: error.message }); // Trả lỗi nếu có
    }
};

// Thêm sản phẩm (cùng với hình ảnh)
const postproduct = async (req, res) => {
    try {
        const productData = req.body;
        const hinhAnhFiles = req.files;
        const result = await productService.createProduct(productData, hinhAnhFiles);

        if (result.status === 'warning') {
            return res.status(201).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Sửa sản phẩm
const putproduct = async (req, res) => {
    const { id } = req.params; // Lấy id từ params

    try {
        const result = await productService.updateProduct(id, req.body); // Gọi hàm service để cập nhật sản phẩm

        // Kiểm tra trạng thái kết quả và trả về mã trạng thái tương ứng
        if (result.status === 'warning') {
            return res.status(201).json(result);
        } else if (result.status === 'error') {
            return res.status(404).json(result);
        }

        res.status(200).json(result); // Trả về phản hồi thành công
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Xóa sản phẩm
const deleteproduct = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await productService.deleteProduct(id); // Gọi hàm service để xóa sản phẩm

        // Kiểm tra trạng thái kết quả và trả về mã trạng thái tương ứng
        if (result.status === 'warning') {
            return res.status(201).json(result);
        } else if (result.status === 'error') {
            return res.status(404).json(result);
        }

        res.status(200).json(result); // Trả về phản hồi thành công
    } catch (error) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Hàm tìm kiếm sản phẩm theo tên
// Hàm tìm kiếm sản phẩm theo tên, giá và loại sản phẩm
const searchProducts = async (req, res) => {
    const { name, minPrice, maxPrice, loaiSanPhamId } = req.query; // Lấy tên, giá từ query string

    try {
        let products;

        // Điều kiện lấy tất cả sản phẩm nếu không có tham số nào được cung cấp
        if (!name && !minPrice && !maxPrice && !loaiSanPhamId) {
            products = await productService.getAllProducts(); // Gọi hàm lấy tất cả sản phẩm
        } else {
            // Khởi tạo một đối tượng chứa các điều kiện tìm kiếm
            const searchConditions = {
                name: name || '', // Tên sản phẩm, mặc định là chuỗi rỗng
                minPrice: minPrice ? parseFloat(minPrice) : null, // Giá tối thiểu
                maxPrice: maxPrice ? parseFloat(maxPrice) : null, // Giá tối đa
                loaiSanPhamId: loaiSanPhamId ? parseInt(loaiSanPhamId) : null // Loại sản phẩm ID
            };

            // Gọi hàm tìm kiếm từ service
            products = await productService.searchProductsByName(
                searchConditions.name,
                searchConditions.minPrice,
                searchConditions.maxPrice,
                searchConditions.loaiSanPhamId
            );
        }

        res.status(200).json(products); // Trả về danh sách sản phẩm
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};












module.exports = { getproduct, postproduct, putproduct, deleteproduct , getProductById , searchProducts };