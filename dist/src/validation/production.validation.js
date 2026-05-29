"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const productionSchema = joi_1.default.object({
    cattleId: joi_1.default.string().uuid().required(),
    productName: joi_1.default.string().valid('MILK', 'MEAT').required(),
    quantity: joi_1.default.number().greater(0).required(),
    productionDate: joi_1.default.date().iso().required(),
    expirationDate: joi_1.default.date().iso().allow(null)
});
const validateProduction = (payload) => productionSchema.validate(payload, { abortEarly: false });
exports.default = validateProduction;
