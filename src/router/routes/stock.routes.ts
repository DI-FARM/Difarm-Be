import { Router } from "express";
import { StockController } from "../../controller/stock.controller";

const router = Router();

router.post("/in", StockController.addStockIn);
router.get("/in", StockController.getStockIn);
router.post("/out", StockController.addStockOut);
router.get("/out", StockController.getStockOut);

export default router;
