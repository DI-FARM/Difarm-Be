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
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const farm_service_1 = __importDefault(require("../service/farm.service"));
const responseHandler = new responseHandler_1.default();
const checkInitialBody = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const RequestUser = req.user.data;
    const { farmId } = req.body;
    if (RequestUser.role === client_1.Roles.ADMIN && farmId) {
        const data = yield farm_service_1.default.getUserFarmById(farmId, RequestUser.userId);
        if (!data) {
            responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, "Farm not found");
            return responseHandler.send(res);
        }
    }
    if (RequestUser.role === client_1.Roles.ADMIN && !farmId) {
        responseHandler.setError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Provide farmId for the manager");
        return responseHandler.send(res);
    }
    next();
});
exports.default = { checkInitialBody };
