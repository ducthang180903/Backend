const express = require('express');
const { createUser, loginUser, logoutUser } = require('../controllers/userController');
const loginsignupRouter = express.Router();

loginsignupRouter.post('/signup', async (req, res) => {
    return await createUser(req, res);
});

loginsignupRouter.post('/login', async (req, res) => {
    return await loginUser(req, res);
});

loginsignupRouter.post('/logout', async (req, res) => {
    return await logoutUser(req, res);
});

module.exports = loginsignupRouter;