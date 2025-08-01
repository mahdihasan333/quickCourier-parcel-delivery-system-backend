"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err instanceof AppError_1.default ? err.statusCode : http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    const message = err instanceof AppError_1.default ? err.message : 'Internal Server Error';
    const errors = err.errors ? err.errors : undefined;
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
