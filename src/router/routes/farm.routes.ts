import { Router } from 'express';
import {
    createFarm,
    getFarms,
    getFarmById,
    updateFarm,
    deleteFarm,
} from '../../controller/farm.controller';
import checkRole from '../../middleware/checkRole.middleware';
const router = Router();

router.post('/', checkRole(["SUPERADMIN"]), createFarm);
router.get('/', getFarms);
router.get('/:id', getFarmById);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

export default router;
