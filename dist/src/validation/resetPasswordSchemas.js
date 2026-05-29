"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'co'] } }).trim().required(),
});
const resetPasswordSchema = joi_1.default.object({
    newPassword: joi_1.default.string().min(8).max(15).regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).required(),
});
exports.default = { forgotPasswordSchema, resetPasswordSchema };
