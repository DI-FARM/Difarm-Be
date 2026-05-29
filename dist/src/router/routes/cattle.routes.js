"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cattle_controller_1 = require("../../controller/cattle.controller");
const checkRole_middleware_1 = __importDefault(require("../../middleware/checkRole.middleware"));
const cattle_middleware_1 = __importDefault(require("../../middleware/cattle.middleware"));
const client_1 = require("@prisma/client");
const farm_middleware_1 = __importDefault(require("../../middleware/farm.middleware"));
const asyncWrapper_1 = __importDefault(require("../../util/asyncWrapper"));
const router = (0, express_1.Router)();
router.post("/:farmId", (0, checkRole_middleware_1.default)([client_1.Roles.SUPERADMIN, client_1.Roles.ADMIN, client_1.Roles.MANAGER]), cattle_middleware_1.default.cattlesValidation, (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), cattle_controller_1.createCattle);
router.get("/:farmId", (0, checkRole_middleware_1.default)([client_1.Roles.SUPERADMIN, client_1.Roles.ADMIN, client_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), cattle_controller_1.getCattles);
router.get("/cattle/:cattleId", (0, checkRole_middleware_1.default)([client_1.Roles.SUPERADMIN, client_1.Roles.ADMIN, client_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(cattle_middleware_1.default.checkUserCattleExists), cattle_controller_1.getCattleById);
router.put("/:cattleId", (0, checkRole_middleware_1.default)([client_1.Roles.ADMIN, client_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(cattle_middleware_1.default.checkUserCattleExists), cattle_controller_1.updateCattle);
router.delete("/:cattleId", (0, checkRole_middleware_1.default)([client_1.Roles.ADMIN, client_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(cattle_middleware_1.default.checkUserCattleExists), cattle_controller_1.deleteCattle);
exports.default = router;
