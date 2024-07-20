import express from 'express';
import authRoute from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import farmRoute from './routes/farm.routes'
import cattleRoute from './routes/cattle.routes'
import productionRoute from './routes/production.routes'
import stockRoute from './routes/stock.routes'
import stockTransactionsRoute from './routes/stockTransaction.routes'
import isAuthorized from '../middleware/isAuthorized.middleware';

const routes = express.Router();

routes.use('/auth', authRoute);
routes.use('/users', isAuthorized, userRoutes);
routes.use('/farms', isAuthorized, farmRoute)
routes.use('/cattles', isAuthorized, cattleRoute)
routes.use('/productions', isAuthorized, productionRoute)
routes.use('/stocks', isAuthorized, stockRoute)
routes.use('/stock-transactions', isAuthorized, stockTransactionsRoute)

export default routes;
