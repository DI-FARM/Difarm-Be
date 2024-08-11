import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../../controller/users.controller';
import checkRole from '../../middleware/checkRole.middleware';
import { Roles } from '../../util/enum/Roles.enum';

const router = Router();

router.post('/', checkRole([Roles.SUPERADMIN,  Roles.ADMIN]), createUser);
router.get('/', checkRole([Roles.SUPERADMIN, Roles.ADMIN]), getAllUsers);
router.get('/:id', checkRole([Roles.SUPERADMIN, Roles.ADMIN]), getUserById);
router.put('/:id', checkRole([Roles.SUPERADMIN]), updateUser);
router.delete('/:id', checkRole([Roles.SUPERADMIN]), deleteUser);

export default router;
