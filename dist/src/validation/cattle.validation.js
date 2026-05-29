"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const cattleSchema = joi_1.default.object({
    tagNumber: joi_1.default.string().min(3).trim().required(),
    breed: joi_1.default.string().min(3).trim().required(),
    gender: joi_1.default.string().valid('Bull', 'Cow', 'Other').required(),
    DOB: joi_1.default.date().iso().required(),
    weight: joi_1.default.number().positive().required(),
    location: joi_1.default.string().min(3).trim().required(),
    farmId: joi_1.default.string().uuid().required(),
    lastCheckupDate: joi_1.default.date().iso().required(),
    // vaccineHistory: Joi.array().items(Joi.string().min(3).trim()),
    vaccineHistory: joi_1.default.string().min(3).trim(),
    purchaseDate: joi_1.default.date().iso().required(),
    price: joi_1.default.number().positive().required(),
});
const validateForm = (schema) => (payload) => schema.validate(payload, { abortEarly: false });
const cattleValidation = validateForm(cattleSchema);
exports.default = cattleValidation;
