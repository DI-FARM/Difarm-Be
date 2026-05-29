"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inserminationValidationMiddleware = exports.veterinValidationMiddleware = exports.vaccinationValidationMiddleware = void 0;
const vaccination_validation_1 = __importDefault(require("../validation/vaccination.validation"));
const veterinarian_validation_1 = __importDefault(require("../validation/veterinarian.validation"));
const insermination_validation_1 = __importDefault(require("../validation/insermination.validation"));
const vaccinationValidationMiddleware = (req, res, next) => {
    const { error } = (0, vaccination_validation_1.default)(req.body);
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
exports.vaccinationValidationMiddleware = vaccinationValidationMiddleware;
const veterinValidationMiddleware = (req, res, next) => {
    const { error } = (0, veterinarian_validation_1.default)(req.body);
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
exports.veterinValidationMiddleware = veterinValidationMiddleware;
const inserminationValidationMiddleware = (req, res, next) => {
    const { error } = (0, insermination_validation_1.default)(req.body);
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
exports.inserminationValidationMiddleware = inserminationValidationMiddleware;
