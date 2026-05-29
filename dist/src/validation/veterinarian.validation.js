"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const veterinSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    farmId: joi_1.default.string().required(),
    phone: joi_1.default.number().min(10).required(),
});
const validateForm = (payload) => veterinSchema.validate(payload, { abortEarly: false });
exports.default = validateForm;
