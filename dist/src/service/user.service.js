"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../db/prisma"));
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const emailExist = yield prisma_1.default.account.findUnique({ where: { email } });
        return emailExist;
    });
}
function getAccountById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma_1.default.account.findUnique({ where: { id }, include: { users: true } });
        return result;
    });
}
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const emailExist = yield prisma_1.default.user.findUnique({
            where: { id },
            include: { farms: true, account: true },
        });
        return emailExist;
    });
}
function resetPassword(email, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(email);
        const result = yield prisma_1.default.account.update({
            where: { email },
            data: { password: newPassword },
        });
        return result;
    });
}
exports.default = { getUserByEmail, resetPassword, getUserById, getAccountById };
