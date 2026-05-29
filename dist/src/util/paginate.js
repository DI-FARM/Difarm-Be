"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const paginate = (data, totalCount, currentPage, pageSize) => {
    const lastPage = Math.ceil(totalCount / pageSize);
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < lastPage ? currentPage + 1 : null;
    return {
        data,
        total: totalCount,
        previousPage,
        nextPage,
        lastPage,
        currentPage,
    };
};
exports.paginate = paginate;
