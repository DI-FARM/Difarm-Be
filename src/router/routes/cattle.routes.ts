import { Router } from 'express';
import {
    createCattle,
    getCattles,
    getCattleById,
    updateCattle,
    deleteCattle,
} from '../../controller/cattle.controller';
import checkRole from '../../middleware/checkRole.middleware';
import cattleMiddleware from "../../middleware/cattle.middleware";
import { Roles } from '@prisma/client';
import farmMiddleware from "../../middleware/farm.middleware";
import asyncWrapper from "../../util/asyncWrapper";

const router = Router();

router.post(
  "/:farmId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  cattleMiddleware.cattlesValidation,
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  createCattle
);
router.get(
  "/:farmId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  getCattles
);
router.get(
  "/cattle/:cattleId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(cattleMiddleware.checkUserCattleExists),
  getCattleById
);
router.put(
  "/:cattleId",
  checkRole([Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(cattleMiddleware.checkUserCattleExists),
  updateCattle
);
router.delete(
  "/:cattleId",
  checkRole([Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(cattleMiddleware.checkUserCattleExists),
  deleteCattle
);

export default router;
