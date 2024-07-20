import { Router, Request, Response } from 'express';
import signupValidation from '../../middleware/signupValidation.middleware';
import { getAllUsers, registerUser, userLogin, userLogout} from '../../controller/auth.controller';

const route = Router();

route.post('/signup', signupValidation, registerUser);
route.post('/login', userLogin);
route.post('/logout', userLogout);
route.get('/users', getAllUsers);


export default route;
