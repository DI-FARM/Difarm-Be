"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const farmSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    location: joi_1.default.string().min(3).required(),
    size: joi_1.default.number().positive().required(),
    type: joi_1.default.string().required(),
    ownerId: joi_1.default.string().required(),
});
const validateFarm = (payload) => farmSchema.validate(payload, { abortEarly: false });
exports.default = validateFarm;
