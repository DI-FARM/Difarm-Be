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
exports.resetPassword = exports.forgotPassword = exports.checkAuth = exports.userAccessToken = exports.userLogout = exports.userLogin = exports.emailVerification = exports.getAllUsers = exports.registerSuperAdmin = exports.registerUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const bcrypt_service_1 = require("../service/bcrypt.service");
const passportLocal_1 = __importDefault(require("../config/passportLocal"));
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const prisma_1 = __importDefault(require("../db/prisma"));
const sendEmail_service_1 = require("../service/sendEmail.service");
const token_service_1 = require("../service/token.service");
const user_service_1 = __importDefault(require("../service/user.service"));
const templateMails_1 = __importDefault(require("../util/templateMails"));
const client_1 = require("@prisma/client");
const farm_service_1 = __importDefault(require("../service/farm.service"));
const paginate_1 = require("../util/paginate");
const responseHandler = new responseHandler_1.default();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, email, gender, phone, password, farmId } = req.body;
        const RequestUser = req.user.data;
        let role;
        const emailExist = yield prisma_1.default.account.findUnique({ where: { email } });
        const phoneExist = yield prisma_1.default.account.findUnique({ where: { phone } });
        const accountExist = yield prisma_1.default.account.findUnique({ where: { username } });
        if (emailExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this email address already exists.");
            return responseHandler.send(res);
        }
        if (phoneExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this phone address already exists.");
            return responseHandler.send(res);
        }
        if (username && accountExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this  username already exists.");
            return responseHandler.send(res);
        }
        if (RequestUser.role === client_1.Roles.SUPERADMIN) {
            role = client_1.Roles.ADMIN;
        }
        else {
            role = client_1.Roles.MANAGER;
        }
        const userAccount = yield prisma_1.default.account.create({
            data: {
                username,
                email,
                phone,
                role,
                password: yield (0, bcrypt_service_1.hashPassword)(password)
            }
        });
        const userData = {
            accountId: userAccount.id,
            fullname,
            gender
        };
        const user = yield prisma_1.default.user.create({ data: userData });
        if (RequestUser.role === client_1.Roles.ADMIN) {
            const body = {
                managerId: user.id
            };
            yield farm_service_1.default.updateFarm(farmId, body);
        }
        const verificationToken = (0, token_service_1.generateEmailVerificationToken)({ userId: user.id });
        const verificationUrl = `http://yourdomain.com/verify-email?token=${verificationToken}`;
        const emailMessage = `Please verify your email by clicking the following link: ${verificationUrl}`;
        yield (0, sendEmail_service_1.sendEmail)(email, 'Email Verification', emailMessage);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, "Registration successful. Please check your email to verify your account.", user);
        return responseHandler.send(res);
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ status: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, error: 'Server error' });
    }
});
exports.registerUser = registerUser;
const registerSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, email, gender, phone, password } = req.body;
        const emailExist = yield prisma_1.default.account.findUnique({ where: { email } });
        const phoneExist = yield prisma_1.default.account.findUnique({ where: { phone } });
        const accountExist = yield prisma_1.default.account.findUnique({
            where: { username },
        });
        if (emailExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this email address already exists.");
            return responseHandler.send(res);
        }
        if (phoneExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this phone address already exists.");
            return responseHandler.send(res);
        }
        if (username && accountExist) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this  username already exists.");
            return responseHandler.send(res);
        }
        const userAccount = yield prisma_1.default.account.create({
            data: {
                username,
                email,
                phone,
                role: "SUPERADMIN",
                password: yield (0, bcrypt_service_1.hashPassword)(password),
            },
        });
        const userData = {
            accountId: userAccount.id,
            fullname,
            gender,
        };
        const user = yield prisma_1.default.user.create({ data: userData });
        const verificationToken = (0, token_service_1.generateEmailVerificationToken)({
            userId: user.id,
        });
        const verificationUrl = `http://yourdomain.com/verify-email?token=${verificationToken}`;
        const emailMessage = `Please verify your email by clicking the following link: ${verificationUrl}`;
        yield (0, sendEmail_service_1.sendEmail)(email, "Email Verification", emailMessage);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.CREATED, "Registration successful. Please check your email to verify your account.", user);
        return responseHandler.send(res);
    }
    catch (error) {
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
            status: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
            error: "Server error",
        });
    }
});
exports.registerSuperAdmin = registerSuperAdmin;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        const users = yield prisma_1.default.user.findMany({
            include: {
                account: true,
            },
            skip,
            take,
        });
        const totalCount = yield prisma_1.default.user.count();
        const paginationResult = (0, paginate_1.paginate)(users, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "Users retrieved successfully", paginationResult);
        return responseHandler.send(res);
    }
    catch (error) {
        console.error('Error retrieving users:', error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error retrieving users");
        return responseHandler.send(res);
    }
});
exports.getAllUsers = getAllUsers;
const emailVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Invalid verification link.' });
    }
    try {
        const decoded = (0, token_service_1.verifyToken)(token, "verify-email");
        const user = yield prisma_1.default.user.findUnique({ where: { id: decoded.userId } });
        const account = yield prisma_1.default.account.findUnique({ where: { id: user === null || user === void 0 ? void 0 : user.accountId } });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Invalid verification link.' });
        }
        if (!account) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Invalid verification link.' });
        }
        yield prisma_1.default.account.update({
            where: { id: account.id },
            data: { status: true }
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Email verified successfully.' });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired verification link.' });
    }
});
exports.emailVerification = emailVerification;
const userLogin = (req, res, next) => {
    passportLocal_1.default.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid email or password');
            return responseHandler.send(res);
        }
        try {
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: 'Login successful',
                    user
                });
            });
        }
        catch (error) {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ status: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, error: 'Server error' });
        }
    })(req, res, next);
};
exports.userLogin = userLogin;
const userLogout = (req, res) => {
    try {
        req.logout(() => {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ status: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, error: 'Server error' });
                }
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: 'Logout successful',
            });
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to logout',
        });
    }
};
exports.userLogout = userLogout;
const userAccessToken = (req, res) => {
    responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "User login is successfully", req.user);
    return responseHandler.send(res);
};
exports.userAccessToken = userAccessToken;
const checkAuth = (req, res) => {
    if (req.isAuthenticated()) {
        res.status(http_status_codes_1.StatusCodes.OK).json({ isAuthenticated: true, user: req.user });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ isAuthenticated: false });
    }
};
exports.checkAuth = checkAuth;
const forgotPassword = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_service_1.default.getUserByEmail(email);
    if (!user) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            message: 'User with email does not exist!',
        });
    }
    const userMeta = {
        email,
        id: user.id
    };
    const verifToken = (0, token_service_1.generateForgotPasswordToken)(userMeta);
    const emailBody = templateMails_1.default.ForgortPasswordTemplate(verifToken);
    yield (0, sendEmail_service_1.sendEmail)(email, "Reset password link", emailBody);
    return res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ message: `we have sent password reset link to your email ${email}` });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    if (!token) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            message: "No token provided",
        });
    }
    const payload = (0, token_service_1.verifyToken)(token, "reset-pass");
    const { email } = payload.data;
    const hashedPassword = yield (0, bcrypt_service_1.hashPassword)(req.body.newPassword);
    yield user_service_1.default.resetPassword(email, hashedPassword);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "You have reset successful your password",
    });
});
exports.resetPassword = resetPassword;
