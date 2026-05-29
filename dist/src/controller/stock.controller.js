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
exports.deleteStock = exports.updateStock = exports.getStockById = exports.getAllStocks = exports.createStock = void 0;
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const Roles_enum_1 = require("../util/enum/Roles.enum");
const prisma_1 = __importDefault(require("../db/prisma"));
const http_status_codes_1 = require("http-status-codes");
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const createStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, quantity, type } = req.body;
    // const userId = (req as any).user.data.userId;
    try {
        const userFarm = req.farm;
        // const userFarm = await prisma.farm.findFirst({
        //   where: { ownerId: userId },
        // });
        if (!userFarm) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Farm not found for the logged-in user.');
            return responseHandler.send(res);
        }
        const quantityFloat = parseFloat(quantity);
        const newStock = yield prisma_1.default.stock.create({
            data: {
                name,
                quantity: quantityFloat,
                farmId: userFarm.id,
                type
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, 'Stock created successfully.', newStock);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating the stock.');
    }
    responseHandler.send(res);
});
exports.createStock = createStock;
const getAllStocks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { farmId } = req.params;
    const user = req.user.data;
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1); // Ensure page is at least 1
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100); // Ensure pageSize is between 1 and 100
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        let stocks;
        if (user.role === Roles_enum_1.Roles.SUPERADMIN) {
            stocks = yield prisma_1.default.stock.findMany({
                include: { farm: true },
                skip,
                take,
            });
        }
        else if (user.role === Roles_enum_1.Roles.ADMIN) {
            stocks = yield prisma_1.default.stock.findMany({
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
        const totalCount = yield prisma_1.default.stock.count({
            where: user.role === Roles_enum_1.Roles.ADMIN ? { farmId } : {},
        });
        const paginationResult = (0, paginate_1.paginate)(stocks, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Stocks retrieved successfully.', paginationResult);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving stocks.');
    }
    return responseHandler.send(res);
});
exports.getAllStocks = getAllStocks;
const getStockById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // const stock = await prisma.stock.findUnique({ where: { id } });
        const stock = req.stock;
        // if (!stock) {
        //   responseHandler.setError(StatusCodes.NOT_FOUND, 'Stock not found.');
        //   return responseHandler.send(res);
        // }
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Stock retrieved successfully.', stock);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving the stock.');
    }
    responseHandler.send(res);
});
exports.getStockById = getStockById;
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, quantity } = req.body;
    try {
        const updatedStock = yield prisma_1.default.stock.update({
            where: { id },
            data: { name, quantity },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Stock updated successfully.', updatedStock);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while updating the stock.');
    }
    responseHandler.send(res);
});
exports.updateStock = updateStock;
const deleteStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.stock.delete({ where: { id } });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Stock deleted successfully.', { data: null });
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while deleting the stock.');
    }
    responseHandler.send(res);
});
exports.deleteStock = deleteStock;
