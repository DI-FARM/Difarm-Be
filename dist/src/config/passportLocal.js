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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const prisma_1 = __importDefault(require("../db/prisma"));
const bcrypt_service_1 = require("../service/bcrypt.service");
const token_service_1 = require("../service/token.service");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFound = yield prisma_1.default.account.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username },
                    { phone: username }
                ]
            }
        });
        if (!userFound) {
            return done(null, false);
        }
        // const userData = await userModel.findOne({accountId: userFound._id})
        const isPasswordValid = userFound.password ? yield (0, bcrypt_service_1.comparePassword)(password, userFound.password) : false;
        if (!isPasswordValid) {
            return done(null, false);
        }
        const userData = yield prisma_1.default.user.findFirst({ where: { accountId: userFound.id } });
        const { id, email, role, status } = userFound;
        const userDataPayLoad = {
            id,
            userId: userData === null || userData === void 0 ? void 0 : userData.id,
            username: userFound.username,
            email,
            role,
            status
        };
        const token = (0, token_service_1.generateToken)(userDataPayLoad);
        return done(null, { userFound: userFound, token });
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => done(null, user));
passport_1.default.deserializeUser((user, done) => done(null, user));
exports.default = passport_1.default;
