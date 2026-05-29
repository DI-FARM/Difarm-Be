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
const productionTotals_service_1 = __importDefault(require("./productionTotals.service"));
const recordTransaction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTransaction.create({ data });
    yield productionTotals_service_1.default.recordAmount(data.farmId, data.productType, -data.quantity);
    return result;
});
const getAllTransactions = (farmId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTransaction.findMany({
        where: { farmId },
    });
    return result;
});
const getSingleTransactions = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTransaction.findUnique({ where: { id }, include: { farm: true } });
    return result;
});
const updateTransactions = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTransaction.update({
        where: { id },
        data,
    });
    return result;
});
const deleteTransactions = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTransaction.delete({
        where: { id },
    });
    return result;
});
const getFarmProductionRecord = (farmId, productType) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTotals.findFirst({
        where: {
            farmId,
            productType,
        },
        select: {
            productType: true,
            totalQuantity: true,
            pricePerUnit: true,
        },
    });
    return result;
});
exports.default = {
    recordTransaction,
    getFarmProductionRecord,
    getAllTransactions,
    getSingleTransactions,
    updateTransactions,
    deleteTransactions
};
