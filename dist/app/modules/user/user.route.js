"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
// src/app/modules/user/user.route.ts
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const auth_validation_1 = require("../auth/auth.validation");
const router = (0, express_1.Router)();
router.post('/register', (0, validateRequest_1.validateRequest)(auth_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
router.get('/all-users', (0, checkAuth_1.checkAuth)('ADMIN'), user_controller_1.UserControllers.getAllUsers);
router.patch('/:id', (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(Object.values(user_interface_1.Role)), user_controller_1.UserControllers.updateUser);
router.delete('/:id', (0, checkAuth_1.checkAuth)([user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN]), user_controller_1.UserControllers.deleteUser);
exports.UserRoutes = router;
