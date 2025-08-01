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
exports.ParcelServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const parcel_model_1 = require("./parcel.model");
const user_model_1 = require("../user/user.model");
const generateTrackingId_1 = require("../../utils/generateTrackingId");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const parcel_interface_1 = require("./parcel.interface");
const user_interface_1 = require("../user/user.interface");
const createParcel = (payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiver, type, weight, senderAddress, receiverAddress, fee } = payload;
    const sender = yield user_model_1.User.findById(senderId);
    const receiverUser = yield user_model_1.User.findById(receiver);
    if (!sender || sender.isActive === 'BLOCKED') {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Sender is invalid or blocked');
    }
    if (!receiverUser || receiverUser.isActive === 'BLOCKED') {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Receiver is invalid or blocked');
    }
    const trackingId = (0, generateTrackingId_1.generateTrackingId)();
    const parcel = yield parcel_model_1.Parcel.create({
        trackingId,
        sender: senderId,
        receiver,
        type,
        weight,
        senderAddress,
        receiverAddress,
        fee,
        status: parcel_interface_1.ParcelStatus.REQUESTED,
        statusLogs: [{ status: parcel_interface_1.ParcelStatus.REQUESTED, timestamp: new Date(), note: 'Parcel created' }],
    });
    return parcel;
});
const cancelParcel = (parcelId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    if (parcel.sender.toString() !== senderId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorized: Not the sender');
    }
    if (parcel.status !== parcel_interface_1.ParcelStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Cannot cancel dispatched parcel');
    }
    if (parcel.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Parcel is blocked');
    }
    parcel.status = parcel_interface_1.ParcelStatus.CANCELLED;
    parcel.statusLogs.push({ status: parcel_interface_1.ParcelStatus.CANCELLED, timestamp: new Date(), note: 'Cancelled by sender' });
    yield parcel.save();
    return parcel;
});
const confirmDelivery = (parcelId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    if (parcel.receiver.toString() !== receiverId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorized: Not the receiver');
    }
    if (parcel.status !== parcel_interface_1.ParcelStatus.IN_TRANSIT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Parcel not in transit');
    }
    if (parcel.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Parcel is blocked');
    }
    parcel.status = parcel_interface_1.ParcelStatus.DELIVERED;
    parcel.statusLogs.push({ status: parcel_interface_1.ParcelStatus.DELIVERED, timestamp: new Date(), note: 'Confirmed by receiver' });
    yield parcel.save();
    return parcel;
});
const updateStatus = (parcelId, status, updatedBy) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validStatusFlow = {
        [parcel_interface_1.ParcelStatus.REQUESTED]: [parcel_interface_1.ParcelStatus.APPROVED, parcel_interface_1.ParcelStatus.CANCELLED],
        [parcel_interface_1.ParcelStatus.APPROVED]: [parcel_interface_1.ParcelStatus.DISPATCHED],
        [parcel_interface_1.ParcelStatus.DISPATCHED]: [parcel_interface_1.ParcelStatus.IN_TRANSIT],
        [parcel_interface_1.ParcelStatus.IN_TRANSIT]: [parcel_interface_1.ParcelStatus.DELIVERED],
    };
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    if (parcel.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Parcel is blocked');
    }
    if (!((_a = validStatusFlow[parcel.status]) === null || _a === void 0 ? void 0 : _a.includes(status))) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Invalid status transition from ${parcel.status} to ${status}`);
    }
    parcel.status = status;
    parcel.statusLogs.push({ status, timestamp: new Date(), updatedBy, note: `Status updated to ${status}` });
    yield parcel.save();
    return parcel;
});
const getParcelsByUser = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let parcels;
    if (role === user_interface_1.Role.ADMIN || role === user_interface_1.Role.SUPER_ADMIN) {
        parcels = yield parcel_model_1.Parcel.find().populate('sender receiver');
    }
    else if (role === user_interface_1.Role.SENDER) {
        parcels = yield parcel_model_1.Parcel.find({ sender: userId }).populate('receiver');
    }
    else if (role === user_interface_1.Role.RECEIVER) {
        parcels = yield parcel_model_1.Parcel.find({ receiver: userId }).populate('sender');
    }
    else {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Invalid role');
    }
    const totalParcels = parcels.length;
    return {
        data: parcels,
        meta: {
            total: totalParcels,
        },
    };
});
const blockParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    parcel.isBlocked = true;
    yield parcel.save();
    return parcel;
});
const unblockParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    parcel.isBlocked = false;
    yield parcel.save();
    return parcel;
});
const deleteParcel = (parcelId, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    if (role !== user_interface_1.Role.ADMIN && role !== user_interface_1.Role.SUPER_ADMIN && parcel.sender.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorized: Only sender or admin can delete');
    }
    if (parcel.status !== parcel_interface_1.ParcelStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Cannot delete dispatched parcel');
    }
    if (parcel.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Parcel is blocked');
    }
    yield parcel.deleteOne();
    return { message: 'Parcel deleted successfully' };
});
exports.ParcelServices = {
    createParcel,
    cancelParcel,
    confirmDelivery,
    updateStatus,
    getParcelsByUser,
    blockParcel,
    unblockParcel,
    deleteParcel,
};
