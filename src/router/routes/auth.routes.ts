import { Router, Request, Response } from 'express';
import signupValidation from '../../middleware/signupValidation.middleware';
import { forgotPassword, getAllUsers, registerUser, resetPassword, userLogin, userLogout} from '../../controller/auth.controller';
import asyncWrapper from "../../util/asyncWrapper";
import validate from "../../middleware/validation/validation";
import resetPasswordSchemas from "../../validation/resetPasswordSchemas";
import checkRole from "../../middleware/checkRole.middleware";
import { Roles } from "@prisma/client";
import isAuthorized from "../../middleware/isAuthorized.middleware";
import authMiddleware from "../../middleware/auth.middleware";

const route = Router();

route.post(
  "/signup",
  isAuthorized,
  checkRole([Roles.ADMIN, Roles.SUPERADMIN]),
  asyncWrapper(authMiddleware.checkInitialBody),
  signupValidation,
  registerUser
);
route.post('/login', userLogin);
route.post('/logout', userLogout);
route.get('/users', getAllUsers);
route.get(
  "/forgotpass/",
  validate(resetPasswordSchemas.forgotPasswordSchema),
  asyncWrapper(forgotPassword)
);
route.get(
  "/resetpass/:token",
  validate(resetPasswordSchemas.resetPasswordSchema),
  asyncWrapper(resetPassword)
);


export default route;
