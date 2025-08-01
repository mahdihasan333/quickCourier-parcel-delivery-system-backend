/* eslint-disable @typescript-eslint/no-non-null-assertion */
// user.controller.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { AuthRequest } from '../../middlewares/checkAuth';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User Created Successfully',
    data: user,
  });
});

const updateUser = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const verifiedToken = req.user;
  const payload = req.body;
  const user = await UserServices.updateUser(userId, payload, verifiedToken!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Updated Successfully',
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const result = await UserServices.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All Users Retrieved Successfully',
    data: result.data,
    meta: result.meta,
  });
});

const deleteUser = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const verifiedToken = req.user;
  const result = await UserServices.deleteUser(userId, verifiedToken!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Deleted Successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};