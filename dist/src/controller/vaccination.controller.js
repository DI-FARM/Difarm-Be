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
exports.updateVaccination = exports.getVaccinationById = exports.getAllVaccinations = exports.recordVaccination = void 0;
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const prisma_1 = __importDefault(require("../db/prisma"));
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const recordVaccination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cattleId, date, vaccineType, vetId, farmId } = req.body;
    try {
        const newVaccination = yield prisma_1.default.vaccination.create({
            data: {
                cattleId,
                date: new Date(date),
                vaccineType,
                vetId,
                farmId
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, 'Vaccination created successfully', newVaccination);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating vaccination');
    }
    return responseHandler.send(res);
});
exports.recordVaccination = recordVaccination;
const getAllVaccinations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const user = req.user.data;
    const { farmId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        let vaccinations;
        if (user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER) {
            vaccinations = yield prisma_1.default.vaccination.findMany({
                where: { farmId },
                orderBy: { date: 'desc' },
                include: { cattle: true, veterinarian: true },
                skip,
                take,
            });
        }
        else {
            vaccinations = yield prisma_1.default.vaccination.findMany({
                orderBy: { date: 'desc' },
                include: { cattle: true, veterinarian: true },
                skip,
                take,
            });
        }
        const totalCount = yield prisma_1.default.vaccination.count({
            where: user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER ? { farmId } : {},
        });
        const paginationResult = (0, paginate_1.paginate)(vaccinations, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Vaccinations retrieved successfully', paginationResult);
    }
    catch (error) {
        console.error('Error retrieving vaccinations:', error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving vaccinations');
    }
    return responseHandler.send(res);
});
exports.getAllVaccinations = getAllVaccinations;
const getVaccinationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id } = req.params;
    try {
        const vaccination = req.vaccine;
        if (vaccination) {
            responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Vaccination retrieved successfully', vaccination);
        }
        else {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Vaccination not found');
        }
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving vaccination');
    }
    return responseHandler.send(res);
});
exports.getVaccinationById = getVaccinationById;
const updateVaccination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vaccineId } = req.params;
    const { cattleId, date, vaccineType, vetId } = req.body;
    try {
        const vaccination = yield prisma_1.default.vaccination.update({
            where: { id: vaccineId },
            data: {
                cattleId,
                date: new Date(date),
                vaccineType,
                vetId,
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Vaccination updated successfully', vaccination);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating vaccination');
    }
    return responseHandler.send(res);
});
exports.updateVaccination = updateVaccination;
