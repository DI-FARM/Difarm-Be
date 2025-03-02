import { Router} from 'express';
import { createStatisticsReport, createStatisticsReportFarm, createStatisticsReportFarmId } from '../../controller/statistics.controller';
import checkRole from '../../middleware/checkRole.middleware';
import { Roles } from '../../util/enum/Roles.enum';



const router = Router();


router.get('/', checkRole([Roles.SUPERADMIN]), createStatisticsReport);
router.get('/farm', checkRole([Roles.SUPERADMIN, Roles.ADMIN]), createStatisticsReportFarm);
router.get('/:farmId', checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]), createStatisticsReportFarmId);

export default router;