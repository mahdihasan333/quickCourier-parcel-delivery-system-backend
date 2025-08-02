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
exports.AuthServices = void 0;
// src/app/modules/auth/auth.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const user_service_1 = require("../user/user.service");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const user_model_1 = require("../user/user.model");
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).lean().exec();
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid email or password');
    }
    if (user.isActive === 'BLOCKED') {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'User is blocked');
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password || '');
    if (!isMatch) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid email or password');
    }
    if (!env_1.envVars.JWT_ACCESS_SECRET) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'JWT_ACCESS_SECRET is not defined');
    }
    if (!env_1.envVars.JWT_ACCESS_EXPIRES) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'JWT_ACCESS_EXPIRES is not defined');
    }
    const tokenPayload = {
        _id: user._id.toString(),
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        isVerified: user.isVerified,
        isDeleted: user.isDeleted,
        auths: user.auths || [],
    };
    const tokenOptions = {
        expiresIn: env_1.envVars.JWT_ACCESS_EXPIRES, // টাইপ মিলবে
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, env_1.envVars.JWT_ACCESS_SECRET, tokenOptions);
    return { token, user };
});
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_service_1.UserServices.createUser(payload);
});
exports.AuthServices = {
    loginUser,
    registerUser,
};
