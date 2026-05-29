"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const newWasteLogSchema = joi_1.default.object({
    date: joi_1.default.date().iso().required(),
    quantity: joi_1.default.number().positive().required(),
    type: joi_1.default.string().valid('DUNG', 'LIQUIDMANURE').required(),
});
exports.default = { newWasteLogSchema };
