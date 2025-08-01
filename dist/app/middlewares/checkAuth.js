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
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = __importDefault(require("../utils/AppError"));
// Extend the Request interface to include user property
// Custom RequestHandler type for AuthRequest
// export type AuthRequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void> | void;
const checkAuth = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "No token provided");
            }
            if (!env_1.envVars.JWT_ACCESS_SECRET) {
                throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "JWT_ACCESS_SECRET is not defined");
            }
            const decoded = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
            if (!decoded._id) {
                throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "No user ID in token");
            }
            const user = yield user_model_1.User.findById(decoded._id).lean().exec();
            if (!user) {
                throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
            }
            const userData = {
                _id: user._id,
                id: user._id.toString(), // id প্রপার্টি যোগ করা হয়েছে
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone,
                picture: user.picture,
                address: user.address,
                isDeleted: (_b = user.isDeleted) !== null && _b !== void 0 ? _b : false,
                isActive: (_c = user.isActive) !== null && _c !== void 0 ? _c : user_interface_1.IsActive.ACTIVE,
                isVerified: (_d = user.isVerified) !== null && _d !== void 0 ? _d : false,
                role: user.role,
                auths: (_e = user.auths) !== null && _e !== void 0 ? _e : [],
            };
            if (userData.isActive === user_interface_1.IsActive.BLOCKED) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User is blocked");
            }
            if (roles.length && !roles.includes(userData.role)) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User does not have required role");
            }
            req.user = userData;
            next();
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Token has expired");
            }
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, error.message || "Invalid token");
        }
    });
};
exports.checkAuth = checkAuth;
