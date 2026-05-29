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
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const insemination_service_1 = __importDefault(require("../service/insemination.service"));
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const checkOwner_middleware_1 = __importDefault(require("./checkOwner.middleware"));
const responseHandler = new responseHandler_1.default();
const checkInseminationExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { inseminationId } = req.params;
    const user = req.user.data;
    const insemination = yield insemination_service_1.default.getSingleInsemination(inseminationId);
    if (!insemination) {
        responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, "insemination with this id not found");
        return responseHandler.send(res);
    }
    if (!(0, checkOwner_middleware_1.default)(insemination, user) &&
        user.role !== client_1.Roles.SUPERADMIN) {
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
            message: "You do not have access to this insemination",
        });
    }
    req.insemination = insemination;
    next();
});
exports.default = { checkInseminationExists };
