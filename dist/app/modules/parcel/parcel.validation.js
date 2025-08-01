"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelStatusZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const parcel_interface_1 = require("./parcel.interface");
exports.createParcelZodSchema = zod_1.default.object({
    receiver: zod_1.default.string({ invalid_type_error: 'Receiver must be a valid ID' }).regex(/^[0-9a-fA-F]{24}$/, {
        message: 'Invalid receiver ID',
    }),
    type: zod_1.default
        .string({ invalid_type_error: 'Type must be string' })
        .min(2, { message: 'Type must be at least 2 characters long.' })
        .max(50, { message: 'Type cannot exceed 50 characters.' }),
    weight: zod_1.default.number({ invalid_type_error: 'Weight must be a number' }).min(0.1, { message: 'Weight must be at least 0.1 kg' }),
    senderAddress: zod_1.default
        .string({ invalid_type_error: 'Sender address must be string' })
        .min(5, { message: 'Sender address must be at least 5 characters long.' }),
    receiverAddress: zod_1.default
        .string({ invalid_type_error: 'Receiver address must be string' })
        .min(5, { message: 'Receiver address must be at least 5 characters long.' }),
    fee: zod_1.default.number({ invalid_type_error: 'Fee must be a number' }).min(0, { message: 'Fee cannot be negative' }),
});
exports.updateParcelStatusZodSchema = zod_1.default.object({
    status: zod_1.default.enum(Object.values(parcel_interface_1.ParcelStatus), { invalid_type_error: 'Invalid status' }),
});
