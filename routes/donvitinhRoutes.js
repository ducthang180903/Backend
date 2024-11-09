const express = require('express');
const DonViTinh = express.Router();
const { getproducttype , postproducttype , putproducttype ,deleteproducttype } = require('../controllers/donvitinhController');


// Route để lấy danh sách loaisp
// router.get('/DVT', getproducttype);
DonViTinh.get('/dvt', async (req, res) => {
    return await getproducttype(req, res);
});
// Route dể thêm loaisp
// router.post('/DVT', postproducttype);
// Route để thêm loại sản phẩm
DonViTinh.post('/dvt', async (req, res) => {
    return await postproducttype(req, res);
});
// Route SỬ loaisp
// router.put('/DVT/:id', putproducttype)
DonViTinh.put('/dvt/:id', async (req, res) => {
    return await putproducttype(req, res);
});;

// Route xóa loaisp
// router.delete('/DVT/:id', deleteproducttype);
// Route để xóa loại sản phẩm
DonViTinh.delete('/dvt/:id', async (req, res) => {
    return await deleteproducttype(req, res);
});


module.exports = DonViTinh;