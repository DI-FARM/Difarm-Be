"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farm_controller_1 = require("../../controller/farm.controller");
const checkRole_middleware_1 = __importDefault(require("../../middleware/checkRole.middleware"));
const farmValidation_middleware_1 = __importDefault(require("../../middleware/farmValidation.middleware"));
const asyncWrapper_1 = __importDefault(require("../../util/asyncWrapper"));
const farm_middleware_1 = __importDefault(require("../../middleware/farm.middleware"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/", (0, checkRole_middleware_1.default)(["SUPERADMIN"]), farmValidation_middleware_1.default, farm_controller_1.createFarm);
router.get("/", farm_controller_1.getFarms);
router.get("/farm/:farmId", (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), farm_controller_1.getFarmById);
router.put("/:farmId", (0, checkRole_middleware_1.default)([client_1.Roles.ADMIN, client_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), farm_controller_1.updateFarm);
router.delete("/:id", (0, checkRole_middleware_1.default)([client_1.Roles.ADMIN, client_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), farm_controller_1.deleteFarm);
exports.default = router;
