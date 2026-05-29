"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_validation_1 = __importDefault(require("../validation/user.validation"));
const signupValidation = (req, res, next) => {
    const { error } = (0, user_validation_1.default)(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            error: error.details.map((detail) => detail.message.replace(/[^a-zA-Z0-9 ]/g, '')),
        });
    }
    else {
        next();
    }
};
exports.default = signupValidation;
