import { Router } from "express";
import { ItemController } from "../../controller/item.controller";

const router = Router();

router.post("/:farmId", ItemController.createItem);
router.get("/", ItemController.getAllItems);
router.get("/farm/:farmId", ItemController.getItemsByFarm);
router.get("/:id", ItemController.getItemById);
router.put("/:id", ItemController.updateItem);
router.delete("/:id", ItemController.deleteItem);

export default router;