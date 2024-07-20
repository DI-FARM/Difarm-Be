import { Router } from 'express';
import {
    createCattle,
    getCattles,
    getCattleById,
    updateCattle,
    deleteCattle,
} from '../../controller/cattle.controller';
import checkRole from '../../middleware/checkRole.middleware';
import cattlesValidation from '../../middleware/cattleValid.middleware';
import { Roles } from '@prisma/client';

const router = Router();

router.post('/', checkRole([Roles.SUPERADMIN, Roles.ADMIN]), cattlesValidation, createCattle);
router.get('/', getCattles);
router.get('/:id', getCattleById);
router.put('/:id', updateCattle);
router.delete('/:id', deleteCattle);

export default router;
