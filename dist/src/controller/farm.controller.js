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
exports.deleteFarm = exports.updateFarm = exports.getFarmById = exports.getFarms = exports.createFarm = void 0;
const http_status_codes_1 = require("http-status-codes");
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const prisma_1 = __importDefault(require("../db/prisma"));
const client_1 = require("@prisma/client");
const responseHandler = new responseHandler_1.default();
const createFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, location, size, type, ownerId } = req.body;
    try {
        const nameExist = yield prisma_1.default.farm.findUnique({ where: { name } });
        if (nameExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "A farm with this name already exists.");
            return responseHandler.send(res);
        }
        const newFarm = yield prisma_1.default.farm.create({
            data: {
                name,
                location,
                size,
                type,
                ownerId,
            },
        });
        responseHandler.setSuccess(201, "Farm created successfully", newFarm);
    }
    catch (error) {
        console.log(error);
        responseHandler.setError(500, "Error creating farm");
    }
    return responseHandler.send(res);
});
exports.createFarm = createFarm;
const getFarms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.data;
        let farms;
        if (user.role === client_1.Roles.ADMIN || user.role === client_1.Roles.MANAGER) {
            farms = yield prisma_1.default.farm.findMany({
                where: { OR: [{ ownerId: user.userId }, { managerId: user.userId }] },
                include: { owner: true },
            });
        }
        else {
            farms = yield prisma_1.default.farm.findMany({
                include: { owner: true },
            });
        }
        responseHandler.setSuccess(200, "Farms retrieved successfully", farms);
    }
    catch (error) {
        responseHandler.setError(500, "Error fetching farms");
    }
    responseHandler.send(res);
});
exports.getFarms = getFarms;
const getFarmById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { farmId } = req.params;
    try {
        const farm = req.farm;
        // const farm = await prisma.farm.findUnique({
        //   where: { id: farmId },
        // });
        if (!farm) {
            responseHandler.setError(404, "Farm not found");
        }
        else {
            responseHandler.setSuccess(200, "Farm retrieved successfully", farm);
        }
    }
    catch (error) {
        responseHandler.setError(500, "Error fetching farm");
    }
    responseHandler.send(res);
});
exports.getFarmById = getFarmById;
const updateFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { farmId } = req.params;
    const { name, location, size, type, ownerId, status } = req.body;
    try {
        const updatedFarm = yield prisma_1.default.farm.update({
            where: { id: farmId },
            data: {
                name,
                location,
                size,
                type,
                ownerId,
                status,
            },
        });
        responseHandler.setSuccess(200, "Farm updated successfully", updatedFarm);
    }
    catch (error) {
        responseHandler.setError(500, "Error updating farm");
    }
    responseHandler.send(res);
});
exports.updateFarm = updateFarm;
const deleteFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { farmId } = req.params;
    try {
        yield prisma_1.default.farm.delete({
            where: { id: farmId },
        });
        responseHandler.setSuccess(204, "Farm deleted successfully", null);
    }
    catch (error) {
        responseHandler.setError(500, "Error deleting farm");
    }
    responseHandler.send(res);
});
exports.deleteFarm = deleteFarm;
