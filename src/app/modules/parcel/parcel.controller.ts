// src/app/modules/parcel/parcel.controller.ts
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelServices } from "./parcel.service";

import AppError from "../../utils/AppError";
import { IUser } from "../user/user.interface";

const createParcel = catchAsync(async (req: Request, res: Response) => {
  if (!req.user)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not logged in");
  const user = req.user as IUser;
  const parcel = await ParcelServices.createParcel(req.body, user.id!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Parcel created successfully",
    data: parcel,
  });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  if (!req.user)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not logged in");
  const user = req.user as IUser;
  const parcel = await ParcelServices.cancelParcel(req.params.id, user.id!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel cancelled successfully",
    data: parcel,
  });
});

const confirmDelivery = catchAsync(async (req: Request, res: Response) => {
  if (!req.user)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not logged in");
  const user = req.user as IUser;
  const parcel = await ParcelServices.confirmDelivery(req.params.id, user.id!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Delivery confirmed successfully",
    data: parcel,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  if (!req.user)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not logged in");
  const user = req.user as IUser;
  const parcel = await ParcelServices.updateStatus(
    req.params.id,
    req.body.status,
    user.id!
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel status updated successfully",
    data: parcel,
  });
});

const getParcels = catchAsync(async (req: Request, res: Response) => {
  if (!req.user)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not logged in");
  const user = req.user as IUser;
  const result = await ParcelServices.getParcelsByUser(user.id!, user.role);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcels retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const blockParcel = catchAsync(async (req: Request, res: Response) => {
  if (!req.user)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not logged in");
  const parcel = await ParcelServices.blockParcel(req.params.id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel blocked successfully",
    data: parcel,
  });
});

const unblockParcel = catchAsync(async (req: Request, res: Response) => {
  if (!req.user)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not logged in");
  const parcel = await ParcelServices.unblockParcel(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel unblocked successfully",
    data: parcel,
  });
});

const deleteParcel = catchAsync(async (req: Request, res: Response) => {
  if (!req.user)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not logged in");
  const user = req.user as IUser;
  const result = await ParcelServices.deleteParcel(
    req.params.id,
    user.id!,
    user.role
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel deleted successfully",
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
