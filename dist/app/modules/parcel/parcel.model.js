"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    note: {
        type: String,
        maxlength: 200,
    },
}, { _id: false });
const parcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    weight: {
        type: Number,
        required: true,
        min: 0.1,
    },
    senderAddress: {
        type: String,
        required: true,
        trim: true,
    },
    receiverAddress: {
        type: String,
        required: true,
        trim: true,
    },
    fee: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.REQUESTED,
    },
    statusLogs: [statusLogSchema],
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });
exports.Parcel = (0, mongoose_1.model)('Parcel', parcelSchema);
