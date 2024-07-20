import { Router } from 'express';
import { createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction } from '../../controller/stockTransactions.controller';
import checkRole  from '../../middleware/checkRole.middleware';
import { Roles } from '../../util/enum/Roles.enum';
import transactionValidation from "../../middleware/stockTransValidation.middleware"

const router = Router();

router.post('/', checkRole([Roles.SUPERADMIN, Roles.MANAGER]),  transactionValidation,  createTransaction);
router.get('/', checkRole([Roles.SUPERADMIN, Roles.MANAGER]), getAllTransactions);
router.get('/:id', checkRole([Roles.ADMIN, Roles.MANAGER]), getTransactionById);
router.put('/:id', checkRole([Roles.ADMIN, Roles.MANAGER]), updateTransaction);
router.delete('/:id', checkRole([Roles.ADMIN, Roles.MANAGER]), deleteTransaction);

export default router;
