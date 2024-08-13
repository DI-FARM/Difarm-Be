import { Router } from "express";
import checkRole from "../../middleware/checkRole.middleware";
import { Roles } from "../../util/enum/Roles.enum";
import {
  recordInsemination,
  getAllInseminations,
  getInseminationById,
  updateInsemination,
} from "../../controller/insermination.controller";
import { inserminationValidationMiddleware } from "../../middleware/vacinationValid.middleware";
import asyncWrapper from "../../util/asyncWrapper";
import farmMiddleware from "../../middleware/farm.middleware";
import inseminationMiddleware from "../../middleware/insemination.middleware";

const router = Router();

router.post(
  "/",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  inserminationValidationMiddleware,
  recordInsemination
);
router.get(
  "/:farmId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  getAllInseminations
);
router.get(
  "insemination/:inseminationId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN,  Roles.MANAGER]),
  asyncWrapper(inseminationMiddleware.checkInseminationExists),
  getInseminationById
);
router.put(
  "/:inseminationId",
  checkRole([Roles.MANAGER, Roles.ADMIN,Roles.SUPERADMIN]),
  asyncWrapper(inseminationMiddleware.checkInseminationExists),
  updateInsemination
);
// router.delete('/:id', checkRole([Roles.SUPERADMIN]), );

export default router;
