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
exports.ParcelControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
const createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.ParcelServices.createParcel(req.body, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'Parcel Created Successfully',
        data: parcel,
    });
}));
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.ParcelServices.cancelParcel(req.params.id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Parcel Cancelled Successfully',
        data: parcel,
    });
}));
const confirmDelivery = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.ParcelServices.confirmDelivery(req.params.id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Delivery Confirmed Successfully!',
        data: parcel,
    });
}));
const updateStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.ParcelServices.updateStatus(req.params.id, req.body.status, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Parcel Status Updated Successfully',
        data: parcel,
    });
}));
const getParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelServices.getParcelsByUser(req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Parcels Retrieved Successfully',
        data: result.data,
        meta: result.meta,
    });
}));
const blockParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.ParcelServices.blockParcel(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Parcel Blocked Successfully',
        data: parcel,
    });
}));
const unblockParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.ParcelServices.unblockParcel(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Parcel Unblocked Successfully',
        data: parcel,
    });
}));
const deleteParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelServices.deleteParcel(req.params.id, req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Parcel Deleted Successfully',
        data: result,
    });
}));
exports.ParcelControllers = {
    createParcel,
    cancelParcel,
    confirmDelivery,
    updateStatus,
    getParcels,
    blockParcel,
    unblockParcel,
    deleteParcel,
};
