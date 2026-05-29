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
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const cattle_validation_1 = __importDefault(require("../validation/cattle.validation"));
const cattle_service_1 = __importDefault(require("../service/cattle.service"));
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const checkOwner_middleware_1 = __importDefault(require("./checkOwner.middleware"));
const responseHandler = new responseHandler_1.default();
const cattlesValidation = (req, res, next) => {
    const { error } = (0, cattle_validation_1.default)(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            error: error.details.map((detail) => detail.message.replace(/[^a-zA-Z0-9 ]/g, '')),
        });
    }
    else {
        next();
    }
};
const checkUserCattleExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cattleId } = req.params;
    const user = req.user.data;
    const cattle = yield cattle_service_1.default.getSingleCattle(cattleId);
    if (!cattle) {
        responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, "Cattle with this id not found");
        return responseHandler.send(res);
    }
    if (!(0, checkOwner_middleware_1.default)(cattle, user) && user.role !== client_1.Roles.SUPERADMIN) {
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
            message: "You do not have access to this cattle",
        });
    }
    req.cattle = cattle;
    next();
});
exports.default = { cattlesValidation, checkUserCattleExists };
