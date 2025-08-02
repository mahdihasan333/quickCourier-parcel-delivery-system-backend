// src/app/middlewares/checkAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { envVars } from '../config/env';
import { IUser, Role, IsActive } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import AppError from '../utils/AppError';

// Extend the Request interface to include user property
export interface AuthRequest extends Request {
  user?: IUser;
}

// Custom RequestHandler type for AuthRequest
export type AuthRequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void> | void;

export const checkAuth = (...roles: Role[]): AuthRequestHandler => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

      const user = await User.findById(decoded._id).lean().exec();
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
      }

      const userData: IUser = {
        _id: user._id,
        id: user._id.toString(), // id প্রপার্টি যোগ করা হয়েছে
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        picture: user.picture,
        address: user.address,
        isDeleted: user.isDeleted ?? false,
        isActive: user.isActive ?? IsActive.ACTIVE,
        isVerified: user.isVerified ?? false,
        role: user.role,
        auths: user.auths ?? [],
      };

      if (userData.isActive === IsActive.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
      }

      if (roles.length && !roles.includes(userData.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'User does not have required role');
      }

      req.user = userData;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired');
      }
      throw new AppError(httpStatus.UNAUTHORIZED, error.message || 'Invalid token');
    }
  };
};