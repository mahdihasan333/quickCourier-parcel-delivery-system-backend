"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../utils/AppError"));
const checkAuth = (...roles) => {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'No token provided');
        }
        try {
            if (!env_1.envVars.JWT_ACCESS_SECRET) {
                throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'JWT_ACCESS_SECRET is not defined');
            }
            const decoded = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (roles.length && !roles.includes(decoded.role)) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Access denied');
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Token has expired');
            }
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Invalid token');
        }
    };
};
exports.checkAuth = checkAuth;
