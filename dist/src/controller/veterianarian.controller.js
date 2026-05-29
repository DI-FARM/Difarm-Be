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
exports.updateVeterinarian = exports.getVeterinarianById = exports.getAllVeterinarians = exports.createVeterinarian = void 0;
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const prisma_1 = __importDefault(require("../db/prisma"));
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const createVeterinarian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, farmId } = req.body;
    try {
        const emailExist = yield prisma_1.default.veterinarian.findUnique({ where: { email } });
        if (emailExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "A veterinarian with this email already exists.");
            return responseHandler.send(res);
        }
        const newVeterinarian = yield prisma_1.default.veterinarian.create({
            data: {
                name,
                phone,
                email,
                farmId
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, 'Veterinarian created successfully', newVeterinarian);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating veterinarian');
    }
    return responseHandler.send(res);
});
exports.createVeterinarian = createVeterinarian;
const getAllVeterinarians = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const user = req.user.data;
    const { farmId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1); // Ensure page is at least 1
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100); // Ensure pageSize is between 1 and 100
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        let veterinarians;
        if (user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER) {
            veterinarians = yield prisma_1.default.veterinarian.findMany({
                where: { farmId },
                skip,
                take,
            });
        }
        else {
            veterinarians = yield prisma_1.default.veterinarian.findMany({
                skip,
                take,
            });
        }
        const totalCount = yield prisma_1.default.veterinarian.count({
            where: user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER ? { farmId } : {},
        });
        // Use the paginate utility to structure the response
        const paginationResult = (0, paginate_1.paginate)(veterinarians, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Veterinarians retrieved successfully', paginationResult);
    }
    catch (error) {
        console.error('Error retrieving veterinarians:', error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving veterinarians');
    }
    return responseHandler.send(res);
});
exports.getAllVeterinarians = getAllVeterinarians;
const getVeterinarianById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id } = req.params;
    try {
        const veterinarian = req.veterian;
        if (veterinarian) {
            responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Veterinarian retrieved successfully', veterinarian);
        }
        else {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Veterinarian not found');
        }
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving veterinarian');
    }
    return responseHandler.send(res);
});
exports.getVeterinarianById = getVeterinarianById;
const updateVeterinarian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vetId } = req.params;
    const { name, phone, email } = req.body;
    try {
        const veterinarian = yield prisma_1.default.veterinarian.update({
            where: { id: vetId },
            data: {
                name,
                phone,
                email,
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Veterinarian updated successfully', veterinarian);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating veterinarian');
    }
    return responseHandler.send(res);
});
exports.updateVeterinarian = updateVeterinarian;
