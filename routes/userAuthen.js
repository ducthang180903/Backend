const express = require('express');
const userAuthen = express.Router();
const { updateUser, deleteUser, checkLogin, logoutUser, deleteUsers, getUsers, updateUserNDSDT, updateUserSDT, updateUserDiaChi, createUser } = require('../controllers/userController');

userAuthen.get('/', async (req, res) => {
    return await getUsers(req, res);
});

userAuthen.post('/', async (req, res) => {
    return await createUser(req, res);
});

userAuthen.put('/:nguoiDungId', async (req, res) => {
    return await updateUser(req, res);
});

userAuthen.delete('/:nguoiDungId', async (req, res) => {
    return await deleteUser(req, res);
});

userAuthen.post('/delete', async (req, res) => {
    return await deleteUsers(req, res);
});

userAuthen.get('/check-login', async (req, res) => {
    return await checkLogin(req, res);
});

userAuthen.post('/logout', async (req, res) => {
    return await logoutUser(req, res);
});

module.exports = userAuthen;