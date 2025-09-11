import { Router } from "express";
import {
  getTotalStockItems,
  getStockValue,
  StockController
} from "../../controller/stock.controller";
import checkRole from "../../middleware/checkRole.middleware";
import { Roles } from "../../util/enum/Roles.enum";
import asyncWrapper from "../../util/asyncWrapper";
import farmMiddleware from "../../middleware/farm.middleware";

const router = Router();

router.post("/in", StockController.addStockIn);
router.get("/in", StockController.getStockIn);
router.post("/out", StockController.addStockOut);
router.get("/out", StockController.getStockOut);

router.get(
  "/total/:farmId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  getTotalStockItems
);
router.get(
  "/total/value/:farmId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  getStockValue
);

export default router;
