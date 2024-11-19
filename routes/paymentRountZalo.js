
const express = require('express');
const paymentzalo = express.Router();
const {createPaymentzalo , checkOrderStatus ,handleCallback } = require('../controllers/paymentzalopayController');


paymentzalo.post('/paymentzalo', async (req, res) => {
    return await createPaymentzalo(req, res);
});

paymentzalo.post('/callback', async (req, res) => {
    return await handleCallback(req, res);
});

paymentzalo.get('/check-status-order/:appTransId', async (req, res) => {
    return await checkOrderStatus(req, res);
});
module.exports = paymentzalo;