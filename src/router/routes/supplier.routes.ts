import { Router } from "express";
import { SupplierController } from "../../controller/supplier.controller";

const router = Router();

router.post("/:farmId", SupplierController.createSupplier);
router.get("/", SupplierController.getAllSuppliers);
router.get("/farm/:farmId", SupplierController.getSuppliersByFarm);
router.get("/:id", SupplierController.getSupplierById);
router.put("/:id", SupplierController.updateSupplier);
router.delete("/:id", SupplierController.deleteSupplier);

export default router;
