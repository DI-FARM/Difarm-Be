"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("../../controller/stock.controller");
const checkRole_middleware_1 = __importDefault(require("../../middleware/checkRole.middleware"));
const Roles_enum_1 = require("../../util/enum/Roles.enum");
const stock_middleware_1 = __importDefault(require("../../middleware/stock.middleware"));
const asyncWrapper_1 = __importDefault(require("../../util/asyncWrapper"));
const farm_middleware_1 = __importDefault(require("../../middleware/farm.middleware"));
const router = (0, express_1.Router)();
router.post("/:farmId", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.SUPERADMIN, Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), stock_middleware_1.default.validationMiddleware, (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), stock_controller_1.createStock);
router.get("/:farmId", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.SUPERADMIN, Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), stock_controller_1.getAllStocks);
router.get("/stock/:id", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.SUPERADMIN, Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(stock_middleware_1.default.checkUserStockExists), stock_controller_1.getStockById);
router.put("/:id", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(stock_middleware_1.default.checkUserStockExists), stock_controller_1.updateStock);
router.delete("/:id", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(stock_middleware_1.default.checkUserStockExists), stock_controller_1.deleteStock);
exports.default = router;
