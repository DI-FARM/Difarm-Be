import { Router } from 'express';
import {
    createFarm,
    getFarms,
    getFarmById,
    updateFarm,
    deleteFarm,
} from '../../controller/farm.controller';
import checkRole from '../../middleware/checkRole.middleware';
import farmValidation from "../../middleware/farmValidation.middleware"

const router = Router();

router.post('/', checkRole(["SUPERADMIN"]), farmValidation,  createFarm);
router.get('/', getFarms);
router.get('/:id', getFarmById);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

export default router;
