"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUtil = void 0;
const searchUtil = (searchTerm, searchableFields) => {
    if (!searchTerm)
        return {};
    const searchConditions = {
        OR: searchableFields.map((field) => ({
            [field]: {
                contains: searchTerm,
                mode: "insensitive",
            },
        })),
    };
    return searchConditions;
};
exports.searchUtil = searchUtil;
