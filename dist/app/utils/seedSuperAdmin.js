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
exports.seedSuperAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const superAdminExists = yield user_model_1.User.findOne({ email: 'superadmin@example.com' });
        if (!superAdminExists) {
            const hashedPassword = yield bcryptjs_1.default.hash('SuperAdmin123!', Number(env_1.envVars.BCRYPT_SALT_ROUND));
            const authProvider = { provider: 'credentials', providerId: 'superadmin@example.com' };
            yield user_model_1.User.create({
                name: 'Super Admin',
                email: 'superadmin@example.com',
                password: hashedPassword,
                role: user_interface_1.Role.SUPER_ADMIN,
                isActive: 'ACTIVE',
                isVerified: true,
                auths: [authProvider],
            });
            console.log('Super Admin seeded successfully');
        }
    }
    catch (error) {
        console.error('Error seeding Super Admin:', error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
