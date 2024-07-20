import { Router } from "express";
import { Roles } from "../../util/enum/Roles.enum";
import { createProduction, deleteProduction, getAllProductions, getProductionById, updateProduction } from "../../controller/production.controller";
import checkRole from "../../middleware/checkRole.middleware";
import productValidation from "../../middleware/productionValidation.middleware"

const router = Router();

router.post('/', productValidation, createProduction);
router.get('/', getAllProductions);
router.get('/:id', getProductionById);
router.put('/:id', updateProduction);
router.delete('/:id', checkRole([Roles.ADMIN, Roles.SUPERADMIN]), deleteProduction);

export default router;