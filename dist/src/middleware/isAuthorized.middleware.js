"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_service_1 = require("../service/token.service");
const http_status_codes_1 = require("http-status-codes");
const isAuthorized = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'Please authenticate' });
        }
        const decoded = (0, token_service_1.verifyToken)(token, "isAuthorized");
        if (!decoded) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'Please authenticate' });
    }
};
exports.default = isAuthorized;
