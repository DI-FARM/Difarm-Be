"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const transactionSchema = joi_1.default.object({
    stockId: joi_1.default.string().required(),
    quantity: joi_1.default.number().positive().required(),
    type: joi_1.default.string().valid('ADDITION', 'CONSUME').required()
});
const validateTransaction = (payload) => transactionSchema.validate(payload, { abortEarly: false });
exports.default = validateTransaction;
