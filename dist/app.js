"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const route_1 = require("./app/routes/route");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1', route_1.router);
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to QuickCourier Parcel Delivery System Backend',
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
