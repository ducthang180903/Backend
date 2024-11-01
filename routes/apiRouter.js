const express = require('express');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const loginsignupRouter = require('./loginsignupRouter');
const producttypeRoutes = require('./producttypeRoutes');
const apiRouter = express.Router();

apiRouter.use('/', loginsignupRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/loaisanpham', producttypeRoutes);
apiRouter.use('/sanpham', productRouter)
module.exports = apiRouter;