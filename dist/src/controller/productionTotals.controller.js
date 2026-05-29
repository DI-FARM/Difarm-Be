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
exports.AllFarmProdTotals = void 0;
const productionTotals_service_1 = __importDefault(require("../service/productionTotals.service"));
const http_status_codes_1 = require("http-status-codes");
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const prisma_1 = __importDefault(require("../db/prisma"));
const client_1 = require("@prisma/client");
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const AllFarmProdTotals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const user = req.user.data;
    const { farmId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        let productions;
        if (user.role === client_1.Roles.SUPERADMIN) {
            productions = yield prisma_1.default.productionTotals.findMany({
                include: { farm: true },
                skip,
                take,
            });
        }
        else {
            productions = yield prisma_1.default.productionTotals.findMany({
                where: { farmId },
                include: { farm: true },
                skip,
                take,
            });
        }
        const totalCount = yield prisma_1.default.productionTotals.count({
            where: user.role === client_1.Roles.ADMIN ? { farmId } : {},
        });
        const paginationResult = (0, paginate_1.paginate)(productions, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Production records retrieved successfully.', paginationResult);
    }
    catch (error) {
        console.error('Error retrieving production records:', error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving production records.');
    }
    return responseHandler.send(res);
});
exports.AllFarmProdTotals = AllFarmProdTotals;
const newProductInfo = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { farmId } = req.params;
    const body = Object.assign(Object.assign({}, req.body), { farmId });
    const data = yield productionTotals_service_1.default.createProductInfo(body);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "product information added successfully", data);
    return responseHandler.send(res);
});
const editProductInfo = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { infoId } = req.params;
    const data = yield productionTotals_service_1.default.updateProductInfo(infoId, req.body);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "product information updated successfully", data);
    return responseHandler.send(res);
});
const removeProductInfo = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { infoId } = req.params;
    const data = yield productionTotals_service_1.default.deleteProductInfo(infoId);
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "product information deleted successfully", data);
    return responseHandler.send(res);
});
const getSingleProductInfo = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.productInfo;
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "product information retrieved successfully", data);
    return responseHandler.send(res);
});
exports.default = {
    AllFarmProdTotals: exports.AllFarmProdTotals,
    newProductInfo,
    editProductInfo,
    removeProductInfo,
    getSingleProductInfo,
};
