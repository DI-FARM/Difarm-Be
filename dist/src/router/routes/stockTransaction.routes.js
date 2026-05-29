"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockTransactions_controller_1 = require("../../controller/stockTransactions.controller");
const checkRole_middleware_1 = __importDefault(require("../../middleware/checkRole.middleware"));
const Roles_enum_1 = require("../../util/enum/Roles.enum");
const stockTrans_middleware_1 = __importDefault(require("../../middleware/stockTrans.middleware"));
const asyncWrapper_1 = __importDefault(require("../../util/asyncWrapper"));
const farm_middleware_1 = __importDefault(require("../../middleware/farm.middleware"));
const router = (0, express_1.Router)();
router.post("/:farmId", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.SUPERADMIN, Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), stockTrans_middleware_1.default.validationMiddleware, (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), stockTransactions_controller_1.createTransaction);
router.get("/:farmId", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.SUPERADMIN, Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(farm_middleware_1.default.checkUserFarmExists), stockTransactions_controller_1.getAllTransactions);
router.get("/transaction/:id", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.SUPERADMIN, Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(stockTrans_middleware_1.default.checkStockTransactionExists), stockTransactions_controller_1.getTransactionById);
router.put("/:id", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(stockTrans_middleware_1.default.checkStockTransactionExists), stockTransactions_controller_1.updateTransaction);
router.delete("/:id", (0, checkRole_middleware_1.default)([Roles_enum_1.Roles.ADMIN, Roles_enum_1.Roles.MANAGER]), (0, asyncWrapper_1.default)(stockTrans_middleware_1.default.checkStockTransactionExists), stockTransactions_controller_1.deleteTransaction);
exports.default = router;
