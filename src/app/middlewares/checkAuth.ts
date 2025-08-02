/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { envVars } from '../config/env';
import { IUser, Role, IsActive } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import AppError from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const checkAuth = (...roles: Role[]): RequestHandler => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
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

      // Fetch user from database
      const user = await User.findById(decoded._id);
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
      }

      if (user.isActive === IsActive.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
      }

      if (roles.length && !roles.includes(user.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized role');
      }

      // Set req.user with id and other necessary fields
      req.user = {
        _id: user._id,
        id: user._id.toString(), // Convert _id to string
        role: user.role,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        isVerified: user.isVerified,
        isDeleted: user.isDeleted,
        auths: user.auths,
      } as IUser;

      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired');
      }
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  };
};