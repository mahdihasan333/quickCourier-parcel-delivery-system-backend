import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { createUserZodSchema } from '../user/user.validation';

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await AuthServices.registerUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User Registered Successfully',
    data: user,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token, user } = await AuthServices.loginUser(req.body.email, req.body.password);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Logged In Successfully',
    data: { token, user },
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
};