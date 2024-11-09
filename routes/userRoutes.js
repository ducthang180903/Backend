const express = require('express');
const userRouter = express.Router();
const { updateUser, deleteUser, checkLogin, logoutUser, createUser, deleteUsers, getUsers } = require('../controllers/userController');

userRouter.get('/', async (req, res) => {
    return await getUsers(req, res);
});

userRouter.post('/', async (req, res) => {
    return await createUser(req, res);
});

userRouter.put('/:nguoiDungId', async (req, res) => {
    return await updateUser(req, res);
});

userRouter.delete('/:nguoiDungId', async (req, res) => {
    return await deleteUser(req, res);
});

userRouter.post('/delete', async (req, res) => {
    return await deleteUsers(req, res);
});

userRouter.get('/check-login', async (req, res) => {
    return await checkLogin(req, res);
});

userRouter.post('/logout', async (req, res) => {
    return await logoutUser(req, res);
});

module.exports = userRouter;