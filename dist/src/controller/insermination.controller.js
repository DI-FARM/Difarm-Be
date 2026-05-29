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
exports.updateInsemination = exports.getInseminationById = exports.getAllInseminations = exports.recordInsemination = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const http_status_codes_1 = require("http-status-codes");
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const client_1 = require("@prisma/client");
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const recordInsemination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cattleId, date, method, type, vetId, farmId } = req.body;
    try {
        const newInsemination = yield prisma_1.default.insemination.create({
            data: {
                cattleId,
                date: new Date(date),
                type,
                method,
                vetId,
                farmId
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, 'Insemination created successfully', newInsemination);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating insemination');
    }
    return responseHandler.send(res);
});
exports.recordInsemination = recordInsemination;
const getAllInseminations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    const user = req.user.data;
    try {
        let inseminations;
        if (user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER) {
            inseminations = yield prisma_1.default.insemination.findMany({
                where: { farmId: req.params.farmId },
                include: { cattle: true, veterinarian: true },
                orderBy: { date: 'desc' },
                skip,
                take,
            });
        }
        else {
            inseminations = yield prisma_1.default.insemination.findMany({
                include: { cattle: true, veterinarian: true },
                orderBy: { date: 'desc' },
                skip,
                take,
            });
        }
        const totalCount = yield prisma_1.default.insemination.count({
            where: user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER ? { farmId: req.params.farmId } : {},
        });
        const paginationResult = (0, paginate_1.paginate)(inseminations, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Inseminations retrieved successfully', paginationResult);
    }
    catch (error) {
        console.error('Error retrieving inseminations:', error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving inseminations');
    }
    return responseHandler.send(res);
});
exports.getAllInseminations = getAllInseminations;
const getInseminationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id } = req.params;
    try {
        const insemination = req.insemination;
        if (insemination) {
            responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Insemination retrieved successfully', insemination);
        }
        else {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Insemination not found');
        }
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving insemination');
    }
    return responseHandler.send(res);
});
exports.getInseminationById = getInseminationById;
const updateInsemination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { inseminationId } = req.params;
    const { cattleId, date, method, vetId } = req.body;
    try {
        const insemination = yield prisma_1.default.insemination.update({
            where: { id: inseminationId },
            data: {
                cattleId,
                date: new Date(date),
                method,
                vetId,
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Insemination updated successfully', insemination);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating insemination');
    }
    return responseHandler.send(res);
});
exports.updateInsemination = updateInsemination;
