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
const wasteLogs_service_1 = __importDefault(require("../service/wasteLogs.service"));
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const http_status_codes_1 = require("http-status-codes");
const responseHandler = new responseHandler_1.default();
const checkWasteLogExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { wasteId } = req.params;
    const data = yield wasteLogs_service_1.default.getWasteLogById(wasteId);
    if (!data) {
        responseHandler.setError(http_status_codes_1.StatusCodes.NOT_FOUND, "waste-log with this id not found");
        return responseHandler.send(res);
    }
    req.wasteLog = data;
    next();
});
exports.default = { checkWasteLogExists };
