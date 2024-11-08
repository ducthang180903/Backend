const express = require('express');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');

const loginsignupRouter = require('./loginsignupRouter');
const producttypeRoutes = require('./producttypeRoutes');
const donvitinhRoutes = require('./donvitinhRoutes');
const cartRoutes = require('./cartRoutes');
const donhangRoutes = require('./donhangRoutes');
const chitietsanphamRoutes = require('./chitietsanphamRoutes');
const { isAdmin, isManager } = require('../middlewares/authMiddleware');
const apiRouter = express.Router();

apiRouter.use('/', loginsignupRouter);
apiRouter.use('/user', isManager, userRouter);
// apiRouter.use('/loaisanpham', producttypeRoutes);
apiRouter.use('/',productRouter);
apiRouter.use('/',producttypeRoutes);
apiRouter.use('/',donvitinhRoutes);
apiRouter.use('/',donhangRoutes);
apiRouter.use('/',chitietsanphamRoutes);
apiRouter.use('/',cartRoutes);
// apiRouter.use('/DVT', donvitinhRoutes);
// apiRouter.use('/', donhangRoutes);
// apiRouter.use('/', chitietsanphamRoutes);

module.exports = apiRouter;