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
const recordAmount = (farmId, productType, Amount) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTotals.upsert({
        where: {
            farmId_productType: {
                farmId,
                productType,
            },
        },
        update: { totalQuantity: { increment: Amount } },
        create: { farmId, productType, totalQuantity: Amount },
    });
    return result;
});
const getFarmProductionTotalAmounts = (farmId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTotals.findMany({
        where: {
            farmId,
        },
        select: {
            id: true,
            productType: true,
            totalQuantity: true,
            pricePerUnit: true,
        },
    });
    return result;
});
const createProductInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTotals.create({ data });
    return result;
});
const updateProductInfo = (infoId, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(infoId, data);
    const result = yield prisma_1.default.productionTotals.update({
        where: { id: infoId },
        data,
    });
    return result;
});
const deleteProductInfo = (infoId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTotals.delete({
        where: { id: infoId },
    });
    return result;
});
const singleProductInfo = (infoId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTotals.findUnique({
        where: { id: infoId },
        include: { farm: true }
    });
    return result;
});
const prodInfo = (farmId, productType) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productionTotals.findFirst({
        where: { farmId, productType },
        include: { farm: true }
    });
    return result;
});
exports.default = {
    recordAmount,
    getFarmProductionTotalAmounts,
    createProductInfo,
    updateProductInfo,
    deleteProductInfo,
    singleProductInfo,
    prodInfo
};
