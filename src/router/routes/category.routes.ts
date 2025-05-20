import { Router } from "express";
import { CategoryController } from "../../controller/category.controller";
import checkCategoryExists from "../../middleware/checkCategoryExists.middleware";

const router = Router();

router.post("/" ,checkCategoryExists,CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;
