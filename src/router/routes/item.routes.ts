import { Router } from "express";
import { ItemController } from "../../controller/item.controller";
import checkItemExists from "../../middleware/checkItemExists.middleware";

const router = Router();

router.post("/:farmId",checkItemExists ,ItemController.createItem);
router.get("/", ItemController.getAllItems);
router.get("/farm/:farmId", ItemController.getItemsByFarm);
router.get("/:id", ItemController.getItemById);
router.put("/:id", ItemController.updateItem);
router.delete("/:id", ItemController.deleteItem);

export default router;