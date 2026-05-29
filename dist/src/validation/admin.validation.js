"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const adminSchema = joi_1.default.object({
    fullname: joi_1.default.string().min(3).trim().required(),
    username: joi_1.default.string().min(3).trim().required(),
    email: joi_1.default.string()
        .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "co"] },
    })
        .trim()
        .required(),
    gender: joi_1.default.string().required(),
    phone: joi_1.default.string().trim(),
    password: joi_1.default.string()
        .min(8)
        .max(15)
        .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
        .required(),
});
exports.default = { adminSchema };
