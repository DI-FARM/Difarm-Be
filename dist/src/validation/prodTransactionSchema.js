"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const newTransactionSchame = joi_1.default.object({
    productType: joi_1.default.string().valid('MILK', 'MEAT', 'DUNG', 'LIQUIDMANURE').required(),
    quantity: joi_1.default.number().greater(0).required(),
    date: joi_1.default.date().iso(),
    consumer: joi_1.default.string().required()
});
const updateTransactionSchame = joi_1.default.object({
    productType: joi_1.default.string().valid('MILK', 'MEAT', 'DUNG', 'LIQUIDMANURE'),
    quantity: joi_1.default.number().greater(0),
    date: joi_1.default.date().iso(),
    consumer: joi_1.default.string()
});
exports.default = { newTransactionSchame, updateTransactionSchame };
