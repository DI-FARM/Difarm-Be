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
const http_status_codes_1 = require("http-status-codes");
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const productionTransaction_service_1 = __importDefault(require("../service/productionTransaction.service"));
const productionTotals_service_1 = __importDefault(require("../service/productionTotals.service"));
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../db/prisma"));
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const addTransaction = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { farmId } = req.params;
    const { quantity, productType } = req.body;
    const amountValue = quantity * ((_a = req.productInfo) === null || _a === void 0 ? void 0 : _a.pricePerUnit);
    const body = Object.assign(Object.assign({}, req.body), { farmId, value: amountValue, productType, total: (_b = req.productInfo) === null || _b === void 0 ? void 0 : _b.totalQuantity });
    const data = yield productionTransaction_service_1.default.recordTransaction(body);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, "transaction recorded successfully", data);
    return responseHandler.send(res);
});
const allTransactions = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { farmId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const user = req.user.data;
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        let transactions;
        if (user.role === client_1.Roles.SUPERADMIN) {
            transactions = yield prisma_1.default.productionTransaction.findMany({
                include: { farm: true },
                skip,
                take,
            });
        }
        else if (user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER) {
            transactions = yield prisma_1.default.productionTransaction.findMany({
                where: { farmId },
                include: { farm: true },
                skip,
                take,
            });
        }
        else {
            responseHandler.setError(http_status_codes_1.StatusCodes.FORBIDDEN, 'You do not have permission to view production transaction record.');
            return responseHandler.send(res);
        }
        const totalCount = yield prisma_1.default.productionTransaction.count({
            where: user.role === client_1.Roles.ADMIN ? { farmId } : {},
        });
        const paginationResult = (0, paginate_1.paginate)(transactions, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "Transaction records retrieved successfully.", paginationResult);
    }
    catch (error) {
        console.error("Error retrieving transaction records:", error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An error occurred while retrieving transaction records.");
    }
    return responseHandler.send(res);
});
const singleTransactions = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.transaction;
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "transaction retrieved successfully", data);
    return responseHandler.send(res);
});
const updateTransactions = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params;
    const { farmId, productType } = req.transaction;
    const { quantity } = req.body;
    if (quantity) {
        console.log(req.transaction.quantity, quantity);
        const updatedQuantity = req.transaction.quantity - quantity;
        const productInfo = yield productionTotals_service_1.default.prodInfo(farmId, productType);
        if (productInfo) {
            if (updatedQuantity + productInfo.totalQuantity < 0) {
                responseHandler.setError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "You have less items left for this product");
                return responseHandler.send(res);
            }
            yield productionTotals_service_1.default.recordAmount(farmId, productType, updatedQuantity);
        }
    }
    const data = yield productionTransaction_service_1.default.updateTransactions(transactionId, req.body);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "transaction updated successfully", data);
    return responseHandler.send(res);
});
const removeTransactions = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params;
    const data = yield productionTransaction_service_1.default.deleteTransactions(transactionId);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "transaction removed successfully", data);
    return responseHandler.send(res);
});
exports.default = {
    addTransaction,
    allTransactions,
    singleTransactions,
    updateTransactions,
    removeTransactions,
};
