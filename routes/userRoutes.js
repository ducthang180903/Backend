const express = require('express');
const userRouter = express.Router();
const { updateUser, deleteUser, checkLogin, logoutUser, createUser, deleteUsers, getUsers ,updateUserNDSDT,getUserById } = require('../controllers/userController');

userRouter.get('/', async (req, res) => {
    return await getUsers(req, res);
});
userRouter.get('/:nguoiDungId', async (req, res) => {
    return await getUserById(req, res);
});
userRouter.post('/', async (req, res) => {
    return await createUser(req, res);
});

userRouter.put('/:nguoiDungId', async (req, res) => {
    return await updateUser(req, res);
});
// Sửa thông tin người dùng
// router.put('/users/ndsdt/:nguoiDungId', updateUserNDSDT); //
userRouter.put('/ndsdt/:nguoiDungId', async (req, res) => {
    return await updateUserNDSDT(req, res);
});
userRouter.delete('/:nguoiDungId', async (req, res) => {
    return await deleteUser(req, res);
});

userRouter.post('/delete', async (req, res) => {
    return await deleteUsers(req, res);
});

userRouter.get('/uesrs/check-login', async (req, res) => {
    return await checkLogin(req, res);
});

userRouter.post('/logout', async (req, res) => {
    return await logoutUser(req, res);
});

module.exports = userRouter;