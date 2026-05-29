"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const inserminationSchema = joi_1.default.object({
    cattleId: joi_1.default.string().required(),
    date: joi_1.default.date().required(),
    method: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    vetId: joi_1.default.string().required(),
    farmId: joi_1.default.string().required(),
});
const validateForm = (payload) => inserminationSchema.validate(payload, { abortEarly: false });
exports.default = validateForm;
