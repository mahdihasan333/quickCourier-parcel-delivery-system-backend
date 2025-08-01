/* eslint-disable @typescript-eslint/no-explicit-any */
// checkAuth.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { envVars } from '../config/env';
import { IUser, Role } from '../modules/user/user.interface';
import AppError from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: IUser; // IUser ব্যবহার করা হচ্ছে
}

export const checkAuth = (...roles: Role[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided');
    }

    try {
      if (!envVars.JWT_ACCESS_SECRET) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT_ACCESS_SECRET is not defined');
      }

      const decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as Partial<IUser>;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (roles.length && !roles.includes(decoded.role!)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied');
      }
      (req as AuthRequest).user = decoded as IUser;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired');
      }
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  };
};