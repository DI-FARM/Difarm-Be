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
const farm_service_1 = __importDefault(require("../service/farm.service"));
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const responseHandler = new responseHandler_1.default();
const checkUserFarmExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { farmId } = req.params;
    const user = req.user.data;
    let data;
    if (user.role === client_1.Roles.SUPERADMIN) {
        data = yield farm_service_1.default.getSingleFarm(farmId);
    }
    else {
        data = yield farm_service_1.default.getUserFarmById(farmId, user.userId);
    }
    if (!data) {
        responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, "Farm not found");
        return responseHandler.send(res);
    }
    req.farm = data;
    next();
});
exports.default = { checkUserFarmExists };
