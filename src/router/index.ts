import express from 'express';
import authRoute from './routes/auth.routes'
import farmRoute from './routes/farm.routes'
import cattleRoute from './routes/cattle.routes'
import isAuthorized from '../middleware/isAuthorized.middleware';

const routes = express.Router();

routes.use('/auth', authRoute);
routes.use('/farms', isAuthorized, farmRoute)
routes.use('/cattles', isAuthorized, cattleRoute)
export default routes;
