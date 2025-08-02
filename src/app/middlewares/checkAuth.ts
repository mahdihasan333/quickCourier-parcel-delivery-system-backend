/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { envVars } from '../config/env';
import { IUser, Role, IsActive } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import AppError from '../utils/AppError';

export const checkAuth = (...roles: Role[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided');
      }

      if (!envVars.JWT_ACCESS_SECRET) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT_ACCESS_SECRET is not defined');
      }

      const decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as Partial<IUser>;
      if (!decoded._id) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'No user ID in token');
      }

      const user = await User.findById(decoded._id).exec();
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
      }

      // IUser ইন্টারফেসে ম্যাপ করা
      const userData: IUser = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        isDeleted: user.isDeleted ?? false,
        role: user.role as Role,
        isActive: user.isActive as IsActive,
        auths: user.auths || {},
      };

      if (userData.isActive === IsActive.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
      }

      if (roles.length && !roles.includes(userData.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'User does not have the required role');
      }

      // req.user এ অ্যাসাইন করা
      req.user = userData as any; // Express-এর Request টাইপে user নেই, তাই any ব্যবহার করা হয়েছে

      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired');
      }
      throw new AppError(httpStatus.UNAUTHORIZED, error.message || 'Invalid token');
    }
  };
};

// Express-এর Request ইন্টারফেসে user প্রোপার্টি যোগ করা
declare module 'express' {
  interface Request {
    user?: IUser;
  }
}