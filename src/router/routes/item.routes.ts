import { Router } from "express";
import { ItemController } from "../../controller/item.controller";
import checkItemExists from "../../middleware/checkItemExists.middleware";
import checkItemIdExists from "../../middleware/checkItemIdExists.middleware";

const router = Router();

router.post("/:farmId",checkItemExists ,ItemController.createItem);
router.get("/", ItemController.getAllItems);
router.get("/farm/:farmId", ItemController.getItemsByFarm);
router.get("/:id",checkItemIdExists, ItemController.getItemById);
router.put("/:id", checkItemIdExists,checkItemExists,ItemController.updateItem);
router.delete("/:id",checkItemIdExists, ItemController.deleteItem);

export default router;