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
exports.deleteUser = exports.updateAccount = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const responseHandler_1 = __importDefault(require("../util/responseHandler"));
const prisma_1 = __importDefault(require("../db/prisma"));
const client_1 = require("@prisma/client");
const farm_service_1 = __importDefault(require("../service/farm.service"));
const http_status_codes_1 = require("http-status-codes");
const paginate_1 = require("../util/paginate");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { accountId, fullname, gender, profilePic } = req.body;
    try {
        const newUser = yield prisma_1.default.user.create({
            data: {
                accountId,
                fullname,
                gender,
                profilePic,
            },
        });
        responseHandler.setSuccess(201, "User created successfully", newUser);
        responseHandler.send(res);
    }
    catch (error) {
        responseHandler.setError(400, "Error creating user");
        responseHandler.send(res);
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const user = req.user.data;
    const { farmId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    try {
        let users = [];
        let totalCount = 0;
        if (user.role === client_1.Roles.SUPERADMIN) {
            totalCount = yield prisma_1.default.user.count();
            users = yield prisma_1.default.user.findMany({
                include: { account: true },
                skip,
                take,
            });
        }
        else {
            const userFarm = yield prisma_1.default.farm.findUnique({
                where: { id: farmId },
                include: { owner: { include: { account: true } } },
            });
            if (userFarm === null || userFarm === void 0 ? void 0 : userFarm.owner) {
                users.push(userFarm.owner);
            }
            if (userFarm === null || userFarm === void 0 ? void 0 : userFarm.managerId) {
                const manager = yield prisma_1.default.user.findUnique({
                    where: { id: userFarm.managerId },
                    include: { account: true },
                });
                if (manager) {
                    users.push(manager);
                }
            }
            totalCount = users.length;
            users = users.slice(skip, skip + take);
        }
        const paginationResult = (0, paginate_1.paginate)(users, totalCount, currentPage, currentPageSize);
        responseHandler.setSuccess(http_status_codes_1.StatusCodes.OK, "Users retrieved successfully", paginationResult);
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        responseHandler.setError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error retrieving users");
    }
    return responseHandler.send(res);
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { userId } = req.params;
    try {
        const user = req.actionUser;
        if (!user) {
            responseHandler.setError(404, "User not found");
            responseHandler.send(res);
            return;
        }
        responseHandler.setSuccess(200, "User retrieved successfully", user);
        responseHandler.send(res);
    }
    catch (error) {
        responseHandler.setError(400, "Error retrieving user");
        responseHandler.send(res);
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { userId } = req.params;
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: Object.assign({}, req.body),
        });
        responseHandler.setSuccess(200, "User updated successfully", updatedUser);
        responseHandler.send(res);
    }
    catch (error) {
        responseHandler.setError(400, "Error updating user");
        responseHandler.send(res);
    }
});
exports.updateUser = updateUser;
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { accId } = req.params;
    const { email, phone, username } = req.body;
    try {
        const updateData = {};
        // Check which fields are provided and add them to the update object
        if (email) {
            const emailExist = yield prisma_1.default.account.findUnique({ where: { email } });
            if (!emailExist) {
                updateData.email = email; // Only add email if it doesn't exist
            }
            else {
                responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this email address already exists.");
                return responseHandler.send(res);
            }
        }
        if (phone) {
            const phoneExist = yield prisma_1.default.account.findUnique({ where: { phone } });
            if (!phoneExist) {
                updateData.phone = phone; // Only add phone if it doesn't exist
            }
            else {
                responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this phone address already exists.");
                return responseHandler.send(res);
            }
        }
        if (username) {
            const accountExist = yield prisma_1.default.account.findUnique({
                where: { username },
            });
            if (!accountExist) {
                updateData.username = username; // Only add username if it doesn't exist
            }
            else {
                responseHandler.setError(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this  username already exists.");
                return responseHandler.send(res);
            }
        }
        const updatedUser = yield prisma_1.default.account.update({
            where: { id: accId },
            data: updateData,
        });
        responseHandler.setSuccess(200, "Account updated successfully", updatedUser);
        responseHandler.send(res);
    }
    catch (error) {
        console.log(error);
        responseHandler.setError(400, "Error updating account");
        responseHandler.send(res);
    }
});
exports.updateAccount = updateAccount;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseHandler = new responseHandler_1.default();
    const { userId } = req.params;
    try {
        yield Promise.all([
            prisma_1.default.user.delete({
                where: { id: userId },
            }),
            prisma_1.default.account.delete({
                where: { id: req.actionUser.accountId },
            }),
        ]);
        if (req.actionUser.account.role == client_1.Roles.MANAGER) {
            const data = yield farm_service_1.default.removeManagerFromFarm(req.actionUser.id);
        }
        responseHandler.setSuccess(200, "User deleted successfully", null);
        responseHandler.send(res);
    }
    catch (error) {
        console.log(error);
        responseHandler.setError(400, "Error deleting user");
        responseHandler.send(res);
    }
});
exports.deleteUser = deleteUser;
