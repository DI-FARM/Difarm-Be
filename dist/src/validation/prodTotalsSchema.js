"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const newProdInfoSchema = joi_1.default.object({
    productType: joi_1.default.string().valid('MILK', 'MEAT', 'DUNG', 'LIQUIDMANURE').required(),
    totalQuantity: joi_1.default.number().greater(0).required(),
    pricePerUnit: joi_1.default.number().greater(0).required(),
});
const updatenewProdInfoSchema = joi_1.default.object({
    productType: joi_1.default.string().valid('MILK', 'MEAT'),
    totalQuantity: joi_1.default.number().greater(0),
    pricePerUnit: joi_1.default.number().greater(0),
});
exports.default = { newProdInfoSchema, updatenewProdInfoSchema };
