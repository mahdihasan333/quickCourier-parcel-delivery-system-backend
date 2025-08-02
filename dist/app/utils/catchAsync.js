"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
// import { AuthRequest } from '../middlewares/checkAuth';
const AppError_1 = __importDefault(require("./AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// জেনেরিক টাইপ ব্যবহার করে Request বা AuthRequest সাপোর্ট করা
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            if (err instanceof AppError_1.default) {
                return res.status(err.statusCode).json({
                    success: false,
                    statusCode: err.statusCode,
                    message: err.message,
                    errors: err.errors,
                });
            }
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                statusCode: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error',
            });
        });
    };
};
exports.catchAsync = catchAsync;
