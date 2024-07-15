import { Router } from 'express';
import {
    createCattle,
    getCattles,
    getCattleById,
    updateCattle,
    deleteCattle,
} from '../../controller/cattle.controller';
import checkRole from '../../middleware/checkRole.middleware';

const router = Router();

router.post('/', checkRole(["SUPERADMIN", "ADMIN"]), createCattle);
router.get('/', getCattles);
router.get('/:id', getCattleById);
router.put('/:id', updateCattle);
router.delete('/:id', deleteCattle);

export default router;
