/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { envVars } from '../config/env';
import { Role, IUser } from '../modules/user/user.interface';
import AppError from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: Partial<IUser>;
}

export const checkAuth = (...roles: Role[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided');
    }

    try {
      const decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as Partial<IUser>;
      if (roles.length && !roles.includes(decoded.role!)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied');
      }
      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired');
      }
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  };
};