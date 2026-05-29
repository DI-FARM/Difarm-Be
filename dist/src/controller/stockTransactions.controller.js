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
exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getAllTransactions = exports.createTransaction = void 0;
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const http_status_codes_1 = require("http-status-codes");
const StockTrans_enum_1 = require("../util/enum/StockTrans.enum");
const client_1 = require("@prisma/client");
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const prisma = new client_1.PrismaClient();
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stockId, quantity, type } = req.body;
    // const { userId } = (req as any).user.data;
    try {
        // const userFarm = await prisma.farm.findFirst({
        //   where: { ownerId: userId },
        // });
        const userFarm = req.farm;
        // if (!userFarm) {
        //   responseHandler.setError(StatusCodes.NOT_FOUND, 'Farm not found for the logged-in user.');
        //   return responseHandler.send(res);
        // }
        const stock = yield prisma.stock.findUnique({ where: { id: stockId } });
        if (!stock) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Stock not found.');
            return responseHandler.send(res);
        }
        const quantityFloat = parseFloat(quantity);
        if (isNaN(quantityFloat) || quantityFloat <= 0) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Quantity must be a positive number.');
            return responseHandler.send(res);
        }
        if (![StockTrans_enum_1.TransactionEnum.ADDITION, StockTrans_enum_1.TransactionEnum.CONSUME].includes(type)) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid transaction type.');
            return responseHandler.send(res);
        }
        const updatedQuantity = type === StockTrans_enum_1.TransactionEnum.ADDITION
            ? stock.quantity + quantityFloat
            : stock.quantity - quantityFloat;
        if (type === StockTrans_enum_1.TransactionEnum.CONSUME && updatedQuantity < 0) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Insufficient stock quantity for this transaction.');
            return responseHandler.send(res);
        }
        const newTransaction = yield prisma.transaction.create({
            data: {
                stockId,
                quantity: quantityFloat,
                type,
                farmId: userFarm.id,
            },
        });
        yield prisma.stock.update({
            where: { id: stockId },
            data: { quantity: updatedQuantity },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, 'Transaction created successfully.', newTransaction);
    }
    catch (error) {
        console.error('Error creating transaction:', error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating the transaction.');
    }
    responseHandler.send(res);
});
exports.createTransaction = createTransaction;
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.data;
    const { farmId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        let stockTransactions;
        if (user.role === client_1.Roles.SUPERADMIN) {
            stockTransactions = yield prisma.transaction.findMany({
                include: { farm: true, stock: true },
                skip,
                take,
            });
        }
        else if (user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER) {
            stockTransactions = yield prisma.transaction.findMany({
                where: { farmId },
                include: { farm: true, stock: true },
                skip,
                take,
            });
        }
        else {
            responseHandler.setError(http_status_codes_1.StatusCodes.FORBIDDEN, 'You do not have permission to view stock transaction records.');
            return responseHandler.send(res);
        }
        const totalCount = yield prisma.transaction.count({
            where: user.role === client_1.Roles.ADMIN ? { farmId } : {},
        });
        const paginationResult = (0, paginate_1.paginate)(stockTransactions, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Transactions retrieved successfully.', paginationResult);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving transactions.');
    }
    responseHandler.send(res);
});
exports.getAllTransactions = getAllTransactions;
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // const transaction = await prisma.transaction.findUnique({ where: { id } });
        const transaction = req.stockTransaction;
        if (!transaction) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Transaction not found.');
            return responseHandler.send(res);
        }
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Transaction retrieved successfully.', transaction);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving the transaction.');
    }
    responseHandler.send(res);
});
exports.getTransactionById = getTransactionById;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quantity, type } = req.body;
    try {
        const transaction = yield prisma.transaction.findUnique({ where: { id } });
        if (!transaction) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Transaction not found.');
            return responseHandler.send(res);
        }
        const stock = yield prisma.stock.findUnique({ where: { id: transaction.stockId } });
        if (!stock) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Stock not found.');
            return responseHandler.send(res);
        }
        const previousQuantity = transaction.quantity;
        const updatedQuantity = type === StockTrans_enum_1.TransactionEnum.ADDITION
            ? stock.quantity + quantity - previousQuantity
            : stock.quantity - quantity + previousQuantity;
        const updatedTransaction = yield prisma.transaction.update({
            where: { id },
            data: { quantity, type },
        });
        yield prisma.stock.update({
            where: { id: transaction.stockId },
            data: { quantity: updatedQuantity },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Transaction updated successfully.', updatedTransaction);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while updating the transaction.');
    }
    responseHandler.send(res);
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const transaction = yield prisma.transaction.findUnique({ where: { id } });
        if (!transaction) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Transaction not found.');
            return responseHandler.send(res);
        }
        const stock = yield prisma.stock.findUnique({ where: { id: transaction.stockId } });
        if (!stock) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Stock not found.');
            return responseHandler.send(res);
        }
        const updatedQuantity = transaction.type === StockTrans_enum_1.TransactionEnum.ADDITION
            ? stock.quantity - transaction.quantity
            : stock.quantity + transaction.quantity;
        yield prisma.stock.update({
            where: { id: transaction.stockId },
            data: { quantity: updatedQuantity },
        });
        yield prisma.transaction.delete({ where: { id } });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Transaction deleted successfully.', { data: null });
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while deleting the transaction.');
    }
    responseHandler.send(res);
});
exports.deleteTransaction = deleteTransaction;
