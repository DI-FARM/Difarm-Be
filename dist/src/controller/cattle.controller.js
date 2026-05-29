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
exports.deleteCattle = exports.updateCattle = exports.getCattleById = exports.getCattles = exports.createCattle = void 0;
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const prisma_1 = __importDefault(require("../db/prisma"));
const http_status_codes_1 = require("http-status-codes");
const paginate_1 = require("../util/paginate");
const createCattle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tagNumber, breed, gender, DOB, weight, location, lastCheckupDate, vaccineHistory, purchaseDate, price, } = req.body;
    const { farmId } = req.params;
    // const { tagNumber, breed, gender, DOB, weight, location, farmId, lastCheckupDate, vaccineHistory, purchaseDate, price } = req.body;
    const responseHandler = new responseHandler_1.default();
    try {
        const tagNumberExist = yield prisma_1.default.cattle.findUnique({
            where: { tagNumber, farmId },
        });
        // const farmExist = await prisma.farm.findUnique({ where: { id: farmId } });
        if (tagNumberExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "A cattle with this  tag number already exists.");
            return responseHandler.send(res);
        }
        // if (!farmExist) {
        //     responseHandler.setError(StatusCodes.NOT_FOUND, "Farm not found.");
        //     return responseHandler.send(res);
        // }
        const weightFloat = parseFloat(weight);
        const priceFloat = parseFloat(price);
        const newCattle = yield prisma_1.default.cattle.create({
            data: {
                tagNumber,
                breed,
                gender,
                DOB,
                weight: weightFloat,
                location,
                farmId,
                lastCheckupDate,
                vaccineHistory,
                purchaseDate,
                price: priceFloat,
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, "Cattle created successfully", newCattle);
        return responseHandler.send(res);
    }
    catch (error) {
        console.log(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error creating cattle");
        return responseHandler.send(res);
    }
});
exports.createCattle = createCattle;
const getCattles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { page = 1, pageSize = 10, search } = req.query;
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        const { farmId } = req.params;
        const searchString = typeof search === 'string' ? search : '';
        const searchCondition = searchString
            ? {
                OR: [
                    { tagNumber: { contains: searchString, mode: 'insensitive' } }, // Case-insensitive search
                    { breed: { contains: searchString, mode: 'insensitive' } },
                    { gender: { contains: searchString, mode: 'insensitive' } },
                    { farm: { name: { contains: searchString, mode: 'insensitive' } } }, // Searching the farm name
                ],
            }
            : {};
        const cattles = yield prisma_1.default.cattle.findMany({
            where: Object.assign({ farmId }, searchCondition),
            include: { farm: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
        const totalCount = yield prisma_1.default.cattle.count({
            where: Object.assign({ farmId }, searchCondition),
        });
        const paginationResult = (0, paginate_1.paginate)(cattles, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, 'Cattles fetched successfully', paginationResult);
        return responseHandler.send(res);
    }
    catch (error) {
        console.error(error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching cattles');
        return responseHandler.send(res);
    }
});
exports.getCattles = getCattles;
const getCattleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cattleId } = req.params;
    const responseHandler = new responseHandler_1.default();
    try {
        const { cattle } = req;
        // const cattle = await prisma.cattle.findUnique({
        //     where: { id },
        // });
        if (!cattle) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, "Cattle not found");
            return responseHandler.send(res);
        }
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "Cattle fetched successfully", cattle);
        return responseHandler.send(res);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error fetching cattle");
        return responseHandler.send(res);
    }
});
exports.getCattleById = getCattleById;
const updateCattle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cattleId } = req.params;
    const { tagNumber, breed, gender, DOB, weight, status, location, farmId, lastCheckupDate, vaccineHistory, purchaseDate, price, } = req.body;
    const responseHandler = new responseHandler_1.default();
    try {
        const updatedCattle = yield prisma_1.default.cattle.update({
            where: { id: cattleId },
            data: {
                tagNumber,
                breed,
                gender,
                DOB,
                weight,
                status,
                location,
                farmId,
                lastCheckupDate,
                vaccineHistory,
                purchaseDate,
                price,
            },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "Cattle updated successfully", updatedCattle);
        return responseHandler.send(res);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error updating cattle");
        return responseHandler.send(res);
    }
});
exports.updateCattle = updateCattle;
const deleteCattle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cattleId } = req.params;
    const responseHandler = new responseHandler_1.default();
    try {
        yield prisma_1.default.cattle.delete({
            where: { id: cattleId },
        });
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "Cattle deleted successfully", null);
        return responseHandler.send(res);
    }
    catch (error) {
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error deleting cattle");
        return responseHandler.send(res);
    }
});
exports.deleteCattle = deleteCattle;
