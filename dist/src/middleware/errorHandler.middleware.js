"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Internal Server Error';
    res.status(errStatus).json({
        code: errStatus,
        message: errMsg,
        error: err,
    });
};
exports.default = ErrorHandler;
