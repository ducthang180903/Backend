const express = require('express');
const { createUser, loginUser } = require('../controllers/userController');
const loginsignupRouter = express.Router();

loginsignupRouter.post('/signup', async (req, res) => {
    return await createUser(req, res);
});

loginsignupRouter.post('/login', async (req, res) => {
    return await loginUser(req, res);
});

module.exports = loginsignupRouter;