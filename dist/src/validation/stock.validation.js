"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const stockSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).trim().required(),
    quantity: joi_1.default.number().greater(0).required(),
    type: joi_1.default.string().valid('FOOD', 'MEDICATION', 'CONSTRUCTION', 'WATER', 'FEED_ACCESSORIES', 'HYGIENE_MATERIALS'),
});
const validateStock = (payload) => stockSchema.validate(payload, { abortEarly: false });
exports.default = validateStock;
