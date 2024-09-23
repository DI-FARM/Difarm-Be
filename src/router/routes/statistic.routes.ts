import { Router} from 'express';
import { createStatisticsReport } from '../../controller/statistics.controller';



const router = Router();


router.get('/', createStatisticsReport);

export default router;