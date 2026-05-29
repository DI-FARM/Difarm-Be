"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allWasteLogs = void 0;
const wasteLogs_service_1 = __importDefault(require("../service/wasteLogs.service"));
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const http_status_codes_1 = require("http-status-codes");
const productionTotals_service_1 = __importDefault(require("../service/productionTotals.service"));
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../db/prisma"));
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const createWasteLog = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, quantity, date } = req.body;
    const { farmId } = req.params;
    const farmWasteData = { type, quantity, date, farmId };
    const newLogResult = yield wasteLogs_service_1.default.addWasteLog(farmWasteData);
    yield productionTotals_service_1.default.recordAmount(// update the totals
    farmId, type, quantity);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, "Waste-log created successfull", newLogResult);
    return responseHandler.send(res);
});
const allWasteLogs = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { farmId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1); // Ensure page is at least 1
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100); // Ensure pageSize is between 1 and 100
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    const user = req.user.data;
    try {
        let wasteLogs;
        if (user.role === client_1.Roles.SUPERADMIN) {
            wasteLogs = yield prisma_1.default.wastesLog.findMany({
                include: { farm: true },
                skip,
                take,
            });
        }
        else if (user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER) {
            wasteLogs = yield prisma_1.default.wastesLog.findMany({
                where: { farmId },
                include: { farm: true },
                skip,
                take,
            });
        }
        else {
            responseHandler.setError(http_status_codes_1.StatusCodes.FORBIDDEN, 'You do not have permission to view production records.');
            return responseHandler.send(res);
        }
        const totalCount = yield prisma_1.default.wastesLog.count({
            where: user.role === client_1.Roles.ADMIN ? { farmId } : {},
        });
        const paginationResult = (0, paginate_1.paginate)(wasteLogs, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "All waste-logs retrieved successfully", paginationResult);
    }
    catch (error) {
        console.error('Error retrieving waste logs:', error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving waste logs');
    }
    return responseHandler.send(res);
});
exports.allWasteLogs = allWasteLogs;
const singleWasteLog = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { wasteId } = req.params;
    const updatedLogResult = yield wasteLogs_service_1.default.getWasteLogById(wasteId);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, "waste-log retrieved successfull", updatedLogResult);
    return responseHandler.send(res);
});
const updateWasteLog = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { wasteId } = req.params;
    const { quantity } = req.body;
    const { farmId, quantity: previousQuantity, type } = req.wasteLog;
    const updatedLogResult = yield wasteLogs_service_1.default.changeWasteLog(req.body, wasteId);
    if (quantity) {
        if (previousQuantity > quantity) {
            const updatedQuantity = previousQuantity - quantity;
            yield productionTotals_service_1.default.recordAmount(farmId, type, -updatedQuantity);
        }
        else {
            const updatedQuantity = quantity - previousQuantity;
            yield productionTotals_service_1.default.recordAmount(farmId, type, updatedQuantity);
        }
    }
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, "Waste-log updated successfull", updatedLogResult);
    return responseHandler.send(res);
});
const deleteWasteLog = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { wasteId } = req.params;
    const deleteLogResult = yield wasteLogs_service_1.default.removeWasteLogById(wasteId);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, "Waste-log deleted successfull", deleteLogResult);
    return responseHandler.send(res);
});
exports.default = {
    createWasteLog,
    updateWasteLog,
    deleteWasteLog,
    allWasteLogs: exports.allWasteLogs,
    singleWasteLog,
};
