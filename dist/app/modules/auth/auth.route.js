"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/register', (0, validateRequest_1.validateRequest)(auth_validation_1.createUserZodSchema), auth_controller_1.AuthControllers.registerUser);
router.post('/login', (0, validateRequest_1.validateRequest)(auth_validation_1.loginUserZodSchema), auth_controller_1.AuthControllers.loginUser);
exports.AuthRoutes = router;
