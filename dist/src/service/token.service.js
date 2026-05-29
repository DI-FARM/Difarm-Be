"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateForgotPasswordToken = exports.verifyToken = exports.generateEmailVerificationToken = exports.generateToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const requireEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required env var: ${key}`);
    }
    return value;
};
const JWT_SECRET = requireEnv("JWT_SECRET");
const JWT_VERIF_SECRET = requireEnv("JWT_VERIF_SECRET");
const EXPIRE_TIME = process.env.EXPIRE_TIME;
const EXPIRE_VERIF_TIME = process.env.EXPIRE_VERIF_TIME;
const generateToken = (data) => {
    const token = jsonwebtoken_1.default.sign({ data }, JWT_SECRET, {
        expiresIn: EXPIRE_TIME,
    });
    return token;
};
exports.generateToken = generateToken;
const generateEmailVerificationToken = (data) => {
    const token = jsonwebtoken_1.default.sign({ data }, JWT_VERIF_SECRET, {
        expiresIn: EXPIRE_VERIF_TIME,
    });
    return token;
};
exports.generateEmailVerificationToken = generateEmailVerificationToken;
const generateForgotPasswordToken = (data) => {
    const token = jsonwebtoken_1.default.sign({ data }, JWT_SECRET);
    return token;
};
exports.generateForgotPasswordToken = generateForgotPasswordToken;
const verifyToken = (token, type) => {
    if (type === "verify-email") {
        return jsonwebtoken_1.default.verify(token, JWT_VERIF_SECRET, (err, decoded) => {
            if (err) {
                return err;
            }
            return decoded;
        });
    }
    return jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return err;
        }
        return decoded;
    });
};
exports.verifyToken = verifyToken;
