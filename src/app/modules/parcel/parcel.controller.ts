/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ParcelServices } from './parcel.service';
import { AuthRequest } from '../../middlewares/checkAuth';
import AppError from '../../utils/AppError';

const createParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'User is not logged in');
  const parcel = await ParcelServices.createParcel(req.body, req.user.id!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Parcel created successfully',
    data: parcel,
  });
});

const cancelParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'User is not logged in');
  const parcel = await ParcelServices.cancelParcel(req.params.id, req.user.id!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel cancelled successfully',
    data: parcel,
  });
});

const confirmDelivery = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'User is not logged in');
  const parcel = await ParcelServices.confirmDelivery(req.params.id, req.user.id!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Delivery confirmed successfully',
    data: parcel,
  });
});

const updateStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'User is not logged in');
  const parcel = await ParcelServices.updateStatus(req.params.id, req.body.status, req.user.id!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel status updated successfully',
    data: parcel,
  });
});

const getParcels = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'User is not logged in');
  const result = await ParcelServices.getParcelsByUser(req.user.id!, req.user.role);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcels retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const blockParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'User is not logged in');
  const parcel = await ParcelServices.blockParcel(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel blocked successfully',
    data: parcel,
  });
});

const unblockParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'User is not logged in');
  const parcel = await ParcelServices.unblockParcel(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel unblocked successfully',
    data: parcel,
  });
});

const deleteParcel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'User is not logged in');
  const result = await ParcelServices.deleteParcel(req.params.id, req.user.id!, req.user.role);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel deleted successfully',
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