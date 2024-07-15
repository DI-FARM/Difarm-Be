import { Router, Request, Response } from 'express';
import signupValidation from '../../middleware/signupValidation.middleware';
import { registerUser, userLogin, userLogout} from '../../controller/auth.controller';

const route = Router();

route.post('/signup', signupValidation, registerUser);
route.post('/login', userLogin);
route.post('/logout', userLogout);


export default route;
