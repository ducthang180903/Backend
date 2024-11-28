const express = require('express');
const productRouter = require('./productRoutes');

const loginsignupRouter = require('./loginsignupRouter');
const producttypeRoutes = require('./producttypeRoutes');
const donvitinhRoutes = require('./donvitinhRoutes');
const cartRoutes = require('./cartRoutes');
const donhangRoutes = require('./donhangRoutes');
const paymentzalo = require('./paymentRountZalo');
const ThanhToan = require('./ThanhToanRoutes');
const chitietsanphamRoutes = require('./chitietsanphamRoutes');
const { isAdmin, isManager, checkLogin } = require('../middlewares/authMiddleware');
const userAuthen = require('./userAuthen');
const userRoutes = require('./userRoutes');
const apiRouter = express.Router();

apiRouter.use('/', loginsignupRouter);
apiRouter.use('/user', checkLogin, userRoutes);
apiRouter.use('/user', checkLogin, isManager, isAdmin, userAuthen);

// apiRouter.use('/loaisanpham', producttypeRoutes);
apiRouter.use('/', productRouter);
apiRouter.use('/', producttypeRoutes);
apiRouter.use('/', donvitinhRoutes);

apiRouter.use('/', donhangRoutes);
apiRouter.use('/', paymentzalo);
apiRouter.use('/', ThanhToan);

apiRouter.use('/', chitietsanphamRoutes);
apiRouter.use('/cart', checkLogin, cartRoutes);
// apiRouter.use('/DVT', donvitinhRoutes);
// apiRouter.use('/', donhangRoutes);
// apiRouter.use('/', chitietsanphamRoutes);

module.exports = apiRouter;