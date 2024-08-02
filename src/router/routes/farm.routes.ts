import { Router } from "express";
import {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} from "../../controller/farm.controller";
import checkRole from "../../middleware/checkRole.middleware";
import farmValidation from "../../middleware/farmValidation.middleware";
import asyncWrapper from "../../util/asyncWrapper";
import farmMiddleware from "../../middleware/farm.middleware";
import { Roles } from "@prisma/client";

const router = Router();

router.post("/", checkRole(["SUPERADMIN"]), farmValidation, createFarm);
router.get("/", getFarms);
router.get(
  "/farm/:farmId",
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  getFarmById
);
router.put(
  "/:farmId",
  checkRole([Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  updateFarm
);
router.delete(
  "/:id",
  checkRole([Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  deleteFarm
);

export default router;
