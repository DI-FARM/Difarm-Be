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
exports.deleteProduction = exports.updateProduction = exports.getProductionById = exports.getAllProductions = exports.createProduction = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const Roles_enum_1 = require("../util/enum/Roles.enum");
const http_status_codes_1 = require("http-status-codes");
const cattle_service_1 = __importDefault(require("../service/cattle.service"));
const productionTotals_service_1 = __importDefault(require("../service/productionTotals.service"));
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const createProduction = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cattleId, productName, quantity, productionDate, expirationDate } = req.body;
    const { userId } = req.user.data;
    const { farmId } = req.params;
    try {
        // const userFarm = await prisma.farm.findFirst({
        //     where: { ownerId: userId },
        // });
        // if (!userFarm) {
        //     responseHandler.setError(404, 'Farm not found for the logged-in user.');
        //     return responseHandler.send(res);
        // }
        const cattleExist = yield prisma_1.default.cattle.findUnique({ where: { id: cattleId } });
        if (!cattleExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, "Cattle not found.");
            return responseHandler.send(res);
        }
        if (cattleExist.status === 'PROCESSED') { // procced cows can't be recorded
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, "Cattle hase been processed.");
            return responseHandler.send(res);
        }
        const quantityFloat = parseFloat(quantity);
        const newProduction = yield prisma_1.default.production.create({
            data: {
                farmId: farmId,
                cattleId,
                productName,
                quantity: quantityFloat,
                productionDate: new Date(productionDate),
                expirationDate: expirationDate ? new Date(expirationDate) : null,
            },
        });
        yield productionTotals_service_1.default.recordAmount(// update the totals
        farmId, productName, quantityFloat);
        if (productName === "MEAT") { // update the cattle status if the product is processed
            yield cattle_service_1.default.changeCattleStatus('PROCESSED', cattleId);
        }
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, 'Production record created successfully.', newProduction);
    }
    catch (error) {
        console.log(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating the production record.');
    }
    responseHandler.send(res);
});
exports.createProduction = createProduction;
const getAllProductions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (user.role === Roles_enum_1.Roles.SUPERADMIN) {
            productions = yield prisma_1.default.production.findMany({
                include: { cattle: true },
                skip,
                take,
            });
        }
        else if (user.role === Roles_enum_1.Roles.ADMIN || user.role === Roles_enum_1.Roles.MANAGER) {
            productions = yield prisma_1.default.production.findMany({
                where: { farmId },
                include: { cattle: true },
                skip,
                take,
            });
        }
        else {
            responseHandler.setError(http_status_codes_1.StatusCodes.FORBIDDEN, 'You do not have permission to view production records.');
            return responseHandler.send(res);
        }
        const totalCount = yield prisma_1.default.production.count({
            where: user.role === Roles_enum_1.Roles.ADMIN ? { farmId } : {},
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
exports.getAllProductions = getAllProductions;
const getProductionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.production;
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Production record retrieved successfully.', data);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving the production record.');
    }
    responseHandler.send(res);
});
exports.getProductionById = getProductionById;
const updateProduction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { productName, quantity, productionDate, expirationDate } = req.body;
    const { farmId, quantity: previousQuantity, productName: prodType } = req.production;
    try {
        const updatedProduction = yield prisma_1.default.production.update({
            where: { id },
            data: {
                productName,
                quantity,
                productionDate: productionDate ? new Date(productionDate) : undefined,
                expirationDate: expirationDate ? new Date(expirationDate) : undefined,
            },
            include: { cattle: true },
        });
        if (quantity) {
            if (previousQuantity > quantity) {
                const updatedQuantity = previousQuantity - quantity;
                yield productionTotals_service_1.default.recordAmount(farmId, prodType, -updatedQuantity);
            }
            else {
                const updatedQuantity = quantity - previousQuantity;
                yield productionTotals_service_1.default.recordAmount(farmId, prodType, updatedQuantity);
            }
        }
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Production record updated successfully.', updatedProduction);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while updating the production record.');
    }
    responseHandler.send(res);
});
exports.updateProduction = updateProduction;
const deleteProduction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.production.delete({
            where: { id },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Production record deleted successfully.', { data: null });
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while deleting the production record.');
    }
    responseHandler.send(res);
});
exports.deleteProduction = deleteProduction;
