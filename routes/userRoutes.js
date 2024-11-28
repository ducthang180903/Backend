const express = require('express');
const userRoutes = express.Router();
const { getUserById, updateUserSDT, updateUserDiaChi, updateUserNDSDT } = require('../controllers/userController');

userRoutes.get('/:nguoiDungId', async (req, res) => {
    return await getUserById(req, res);
});

userRoutes.put('/update/sdt', async (req, res) => {
    return await updateUserSDT(req, res);
});

userRoutes.put('/update/diachi', async (req, res) => {
    return await updateUserDiaChi(req, res);
});

userRoutes.put('/tt/:nguoiDungId', async (req, res) => {
    return await updateUserNDSDT(req, res);
});

module.exports = userRoutes;