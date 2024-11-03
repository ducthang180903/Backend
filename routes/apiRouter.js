const express = require('express');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const loginsignupRouter = require('./loginsignupRouter');
const producttypeRoutes = require('./producttypeRoutes');
const { isAdmin, isManager } = require('../middlewares/authMiddleware');
const apiRouter = express.Router();

apiRouter.use('/', loginsignupRouter);
apiRouter.use('/user', isManager, userRouter);
apiRouter.use('/loaisanpham', isManager, producttypeRoutes);
apiRouter.use('/sanpham', isManager, productRouter);

module.exports = apiRouter;