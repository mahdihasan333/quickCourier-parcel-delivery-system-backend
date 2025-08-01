/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ParcelServices } from './parcel.service';
import { AuthRequest } from '../../middlewares/checkAuth';

const createParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parcel = await ParcelServices.createParcel(req.body, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Parcel Created Successfully',
    data: parcel,
  });
});

const cancelParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parcel = await ParcelServices.cancelParcel(req.params.id, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel Cancelled Successfully',
    data: parcel,
  });
});

const confirmDelivery = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parcel = await ParcelServices.confirmDelivery(req.params.id, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Delivery Confirmed Successfully!',
    data: parcel,
  });
});

const updateStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parcel = await ParcelServices.updateStatus(req.params.id, req.body.status, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel Status Updated Successfully',
    data: parcel,
  });
});

const getParcels = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const result = await ParcelServices.getParcelsByUser(req.user!.id, req.user!.role);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcels Retrieved Successfully',
    data: result.data,
    meta: result.meta,
  });
});

const blockParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parcel = await ParcelServices.blockParcel(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel Blocked Successfully',
    data: parcel,
  });
});

const unblockParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parcel = await ParcelServices.unblockParcel(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel Unblocked Successfully',
    data: parcel,
  });
});

const deleteParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const result = await ParcelServices.deleteParcel(req.params.id, req.user!.id, req.user!.role);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel Deleted Successfully',
    data: result,
  });
});

export const ParcelControllers = {
  createParcel,
  cancelParcel,
  confirmDelivery,
  updateStatus,
  getParcels,
  blockParcel,
  unblockParcel,
  deleteParcel,
};