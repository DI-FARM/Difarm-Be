"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHandler {
    constructor() {
        this.statusCode = 200;
        this.message = '';
        this.data = null;
        this.type = '';
    }
    setSuccess(statusCode, message, data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.type = 'success';
    }
    setError(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
        this.type = 'error';
    }
    send(res) {
        if (this.type === 'success') {
            res.status(this.statusCode).json({
                status: this.statusCode,
                message: this.message,
                data: this.data,
            });
        }
        else {
            res.status(this.statusCode).json({
                status: this.statusCode,
                message: this.message,
            });
        }
    }
}
exports.default = ResponseHandler;
