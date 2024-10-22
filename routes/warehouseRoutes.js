const express = require('express');
const { getkhoWithProducts , postkhoWithProducts , putkhoWithProducts , deletekhoWithProducts} = require('../controllers/warehouseController');
const router = express.Router();


// Route để lấy danh sách SP
router.get('/kho', getkhoWithProducts);

router.post('/kho', postkhoWithProducts);

router.put('/kho/:id', putkhoWithProducts);

router.delete('/kho/:id', deletekhoWithProducts);

module.exports = router;