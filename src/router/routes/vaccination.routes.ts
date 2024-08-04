import { Router } from "express";
import checkRole from "../../middleware/checkRole.middleware";
import { Roles } from "../../util/enum/Roles.enum";
import {
  getAllVaccinations,
  getVaccinationById,
  recordVaccination,
  updateVaccination,
} from "../../controller/vaccination.controller";
import { vaccinationValidationMiddleware } from "../../middleware/vacinationValid.middleware";
import asyncWrapper from "../../util/asyncWrapper";
import farmMiddleware from "../../middleware/farm.middleware";
import vaccinationMiddleware from "../../middleware/vaccination.middleware";

const router = Router();

router.post(
  "/",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  vaccinationValidationMiddleware,
  recordVaccination
);
router.get(
  "/:farmId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(farmMiddleware.checkUserFarmExists),
  getAllVaccinations
);
router.get(
  "/vaccine/:vaccineId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(vaccinationMiddleware.checkUservaccineExists),
  getVaccinationById
);
router.put(
  "/:vaccineId",
  checkRole([Roles.SUPERADMIN, Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(vaccinationMiddleware.checkUservaccineExists),
  updateVaccination
);
// router.delete('/:id', checkRole([Roles.SUPERADMIN]), );

export default router;
