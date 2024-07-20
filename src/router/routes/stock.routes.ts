import { Router } from 'express';
import { createStock, getAllStocks, getStockById, updateStock, deleteStock } from '../../controller/stock.controller';
import  checkRole from '../../middleware/checkRole.middleware';
import { Roles } from '../../util/enum/Roles.enum';
import stockValidation from "../../middleware/stockValidation.middleware";

const router = Router();

router.post('/', checkRole([Roles.ADMIN, Roles.MANAGER]), stockValidation, createStock);
router.get('/', checkRole([Roles.ADMIN, Roles.MANAGER]), getAllStocks);
router.get('/:id', checkRole([Roles.ADMIN, Roles.MANAGER]), getStockById);
router.put('/:id', checkRole([Roles.ADMIN, Roles.MANAGER]), updateStock);
router.delete('/:id', checkRole([Roles.ADMIN, Roles.MANAGER]), deleteStock);

export default router;
